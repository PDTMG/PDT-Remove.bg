package in.paduti.removebg.security;

import java.math.BigInteger;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ClerkJwksProvider {

    @Value("${clerk.jwks-url}")
    private String jwksUrl;

    private final Map<String, PublicKey> keyCache = new ConcurrentHashMap<>();
    private long lastFetchTime = 0;
    private static final long CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

    public PublicKey getPublicKey(String kid) throws Exception {
        // Trả về từ cache nếu còn hợp lệ
        if (keyCache.containsKey(kid) && (System.currentTimeMillis() - lastFetchTime) < CACHE_TTL) {
            return keyCache.get(kid);
        }

        // Tải lại key nếu chưa có hoặc hết hạn
        refreshKeys();

        // Sau khi tải lại, trả key nếu tồn tại
        return keyCache.get(kid);
    }

    private void refreshKeys() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jwksJson = mapper.readTree(new URL(jwksUrl));
        JsonNode keys = jwksJson.get("keys");

        if (keys == null || !keys.isArray()) {
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
                continue; // Bỏ qua key không hợp lệ
            }

            PublicKey publicKey = createPublicKey(n, e);
            updatedKeys.put(kid, publicKey);
        }

        // Cập nhật cache
        keyCache.clear();
        keyCache.putAll(updatedKeys);
        lastFetchTime = System.currentTimeMillis();
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
