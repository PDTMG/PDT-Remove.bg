
package in.paduti.removebg.security;

import java.io.IOException;
import java.security.PublicKey;
import java.util.Base64;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ClerkJwtAuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(ClerkJwtAuthFilter.class);

    @Value("${clerk.issuer}")
    private String clerkIssuer;

    private final ClerkJwksProvider jwksProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Bỏ qua các endpoint không cần xác thực
        if (path.startsWith("/api/webhooks") || path.startsWith("/api/payment/vnpay-return")
                || path.startsWith("/api/payment/vnpay-ipn")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Authentication header missing or invalid for path: {}", path);
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Authentication header missing or invalid");
            return;
        }

        String token = authHeader.substring(7);
        try {
            // Decode header để lấy kid
            String[] chunks = token.split("\\.");
            if (chunks.length != 3) {
                logger.error("Malformed JWT token for path: {}", path);
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Malformed JWT token");
                return;
            }

            String headerJson = new String(Base64.getUrlDecoder().decode(chunks[0]));
            ObjectMapper mapper = new ObjectMapper();
            JsonNode header = mapper.readTree(headerJson);
            String kid = header.has("kid") ? header.get("kid").asText() : null;

            if (kid == null) {
                logger.error("JWT header missing 'kid' for path: {}", path);
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "JWT header missing 'kid'");
                return;
            }

            // Lấy public key từ Clerk
            PublicKey publicKey = jwksProvider.getPublicKey(kid);
            if (publicKey == null) {
                logger.error("Public key not found for kid: {} on path: {}", kid, path);
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Public key not found for kid: " + kid);
                return;
            }

            // Xác thực token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .setAllowedClockSkewSeconds(180) // Cho phép lệch giờ 3 phút
                    .requireIssuer(clerkIssuer)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String clerkUserId = claims.getSubject();
            if (clerkUserId == null) {
                logger.error("No subject (user ID) in JWT claims for path: {}", path);
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "No user ID in token");
                return;
            }

            // Lấy vai trò từ claims (nếu có), mặc định ROLE_USER
            String role = claims.get("role", String.class) != null ? claims.get("role", String.class) : "ROLE_USER";
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    clerkUserId, null, Collections.singletonList(new SimpleGrantedAuthority(role)));
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            logger.info("Successfully authenticated user: {} with role: {} for path: {}", clerkUserId, role, path);
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            logger.error("Invalid JWT token for path: {} - Error: {}", path, e.getMessage(), e);
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid JWT token: " + e.getMessage());
        }
    }
}
