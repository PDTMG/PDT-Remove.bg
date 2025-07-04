package in.paduti.removebg.security;

import java.math.BigInteger;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ClerkJwksProvider {

    private static final Logger logger = LoggerFactory.getLogger(ClerkJwksProvider.class);

    @Value("${clerk.jwks-url}")
    private String jwksUrl;

    private final Map<String, PublicKey> keyCache = new ConcurrentHashMap<>();
    private long lastFetchTime = 0;
    private static final long CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
    private final ReentrantLock lock = new ReentrantLock(); // Đảm bảo thread-safe

    private final ObjectMapper mapper = new ObjectMapper();

    public PublicKey getPublicKey(String kid) {
        if (kid == null) {
            logger.warn("Kid is null, returning null public key");
            return null;
        }

        // Trả về từ cache nếu còn hợp lệ
        if (keyCache.containsKey(kid) && (System.currentTimeMillis() - lastFetchTime) < CACHE_TTL) {
            PublicKey cachedKey = keyCache.get(kid);
            if (cachedKey != null) {
                logger.debug("Returning cached public key for kid: {}", kid);
                return cachedKey;
            }
        }

        // Làm mới key nếu cần, với khóa để tránh race condition
        lock.lock();
        try {
            if (keyCache.isEmpty() || (System.currentTimeMillis() - lastFetchTime) >= CACHE_TTL) {
                refreshKeys();
            }
        } catch (Exception e) {
            logger.error("Failed to refresh JWKS keys: {}", e.getMessage(), e);
        } finally {
            lock.unlock();
        }

        // Trả về key sau khi làm mới
        PublicKey publicKey = keyCache.get(kid);
        if (publicKey == null) {
            logger.error("No public key found for kid: {} after refresh", kid);
        } else {
            logger.debug("Returning refreshed public key for kid: {}", kid);
        }
        return publicKey;
    }

    private void refreshKeys() throws Exception {
        logger.info("Refreshing JWKS keys from: {} at {}", jwksUrl, new java.util.Date());
        try {
            JsonNode jwksJson = mapper.readTree(new URL(jwksUrl));
            JsonNode keys = jwksJson.get("keys");

            if (keys == null || !keys.isArray()) {
                logger.error("Invalid JWKS response from Clerk: No 'keys' array found");
                throw new IllegalStateException("Invalid JWKS response from Clerk");
            }

            Map<String, PublicKey> updatedKeys = new ConcurrentHashMap<>();
            for (JsonNode keyNode : keys) {
                String kid = keyNode.has("kid") ? keyNode.get("kid").asText() : null;
                String kty = keyNode.has("kty") ? keyNode.get("kty").asText() : null;
                String alg = keyNode.has("alg") ? keyNode.get("alg").asText() : null;
                String n = keyNode.has("n") ? keyNode.get("n").asText() : null;
                String e = keyNode.has("e") ? keyNode.get("e").asText() : null;

                if (kid == null || !"RSA".equals(kty) || !"RS256".equals(alg) || n == null || e == null) {
                    logger.warn("Skipping invalid key entry for kid: {}, kty: {}, alg: {}", kid, kty, alg);
                    continue;
                }

                try {
                    PublicKey publicKey = createPublicKey(n, e);
                    updatedKeys.put(kid, publicKey);
                    logger.debug("Added public key for kid: {}", kid);
                } catch (Exception x) {
                    logger.error("Failed to create public key for kid: {}, error: {}", kid, x.getMessage());
                }
            }

            // Cập nhật cache
            keyCache.clear();
            keyCache.putAll(updatedKeys);
            lastFetchTime = System.currentTimeMillis();
            logger.info("Successfully refreshed {} public keys", updatedKeys.size());
        } catch (Exception e) {
            logger.error("Failed to refresh JWKS keys from {}: {}", jwksUrl, e.getMessage(), e);
            throw e; // Ném ngoại lệ để xử lý ở cấp cao hơn nếu cần
        }
    }

    private PublicKey createPublicKey(String modulusBase64Url, String exponentBase64Url) throws Exception {
        byte[] modulusBytes = Base64.getUrlDecoder().decode(modulusBase64Url);
        byte[] exponentBytes = Base64.getUrlDecoder().decode(exponentBase64Url);

        BigInteger modulus = new BigInteger(1, modulusBytes);
        BigInteger exponent = new BigInteger(1, exponentBytes);

        RSAPublicKeySpec spec = new RSAPublicKeySpec(modulus, exponent);
        return KeyFactory.getInstance("RSA").generatePublic(spec);
    }
}