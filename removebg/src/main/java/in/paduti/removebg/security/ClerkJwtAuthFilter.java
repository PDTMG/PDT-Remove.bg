package in.paduti.removebg.security;

import java.io.IOException;
import java.security.PublicKey;
import java.util.Base64;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Value("${clerk.issuer}")
    private String clerkIssuer;

    private final ClerkJwksProvider jwksProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Bỏ qua các endpoint không cần xác thực
        if (path.startsWith("/api/webhooks")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Authentication header missing or invalid");
            return;
        }

        try {
            String token = authHeader.substring(7);

            // Decode header để lấy kid
            String[] chunks = token.split("\\.");
            if (chunks.length != 3) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Malformed JWT token");
                return;
            }

            String headerJson = new String(Base64.getUrlDecoder().decode(chunks[0]));
            ObjectMapper mapper = new ObjectMapper();
            JsonNode header = mapper.readTree(headerJson);
            String kid = header.has("kid") ? header.get("kid").asText() : null;

            if (kid == null) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "JWT header missing 'kid'");
                return;
            }

            // Lấy public key từ Clerk
            PublicKey publicKey = jwksProvider.getPublicKey(kid);
            if (publicKey == null) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Public key not found for kid: " + kid);
                return;
            }

            // Xác thực token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .setAllowedClockSkewSeconds(180) // cho phép lệch giờ 1 phút
                    .requireIssuer(clerkIssuer)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String clerkUserId = claims.getSubject();

            // Thiết lập thông tin xác thực vào Spring Security
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    clerkUserId, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            // Tiếp tục chuỗi lọc
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            e.printStackTrace(); // Log lỗi ra console
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid JWT token: " + e.getMessage());
        }
    }
}
