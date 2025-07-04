package in.paduti.removebg.service.impl;

import in.paduti.removebg.service.VnPayService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Slf4j
public class VnPayServiceImpl implements VnPayService {

    @Value("${vnpay.tmncode}")
    private String vnpTmnCode;

    @Value("${vnpay.hashsecret}")
    private String vnpHashSecret;

    @Value("${vnpay.url}")
    private String vnpUrl;

    @Override
    public String createPaymentUrl(String orderId, double amount, String clientIp, String returnUrl) {
        log.info("Creating VNPay payment URL for order: {}, amount: {}", orderId, amount);

        if (orderId == null || orderId.isEmpty()) {
            throw new IllegalArgumentException("Order ID cannot be empty");
        }
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = "127.0.0.1";
        } else if ("0:0:0:0:0:0:0:1".equals(clientIp) || "::1".equals(clientIp)) {
            // Fix IPv6 localhost to IPv4
            clientIp = "127.0.0.1";
        }
        if (returnUrl == null || returnUrl.isEmpty()) {
            throw new IllegalArgumentException("Return URL cannot be empty");
        }

        // Validate hash secret
        if (vnpHashSecret == null || vnpHashSecret.trim().isEmpty()) {
            log.error("VNPay hash secret is not configured properly");
            throw new RuntimeException("VNPay hash secret is not configured");
        }

        try {
            // Tạo parameters theo thứ tự alphabet
            Map<String, String> params = new TreeMap<>();
            params.put("vnp_Version", "2.1.0");
            params.put("vnp_Command", "pay");
            params.put("vnp_TmnCode", vnpTmnCode);

            // VNPay yêu cầu amount * 100 (đơn vị VND)
            long vnpAmount = Math.round(amount * 100);
            params.put("vnp_Amount", String.valueOf(vnpAmount));
            params.put("vnp_CurrCode", "VND");
            params.put("vnp_TxnRef", orderId);
            params.put("vnp_OrderInfo", "Thanh toan don hang " + orderId);
            params.put("vnp_OrderType", "other");
            params.put("vnp_Locale", "vn");
            params.put("vnp_ReturnUrl", returnUrl);
            params.put("vnp_IpAddr", clientIp);

            // Tạo thời gian
            SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmss");
            Date now = new Date();
            params.put("vnp_CreateDate", fmt.format(now));
            // Hết hạn sau 15 phút
            params.put("vnp_ExpireDate", fmt.format(new Date(now.getTime() + 15 * 60 * 1000)));

            // Tạo hash data - CÓ encode URL
            StringBuilder hashData = new StringBuilder();
            boolean first = true;
            for (Map.Entry<String, String> entry : params.entrySet()) {
                if (!first) {
                    hashData.append("&");
                }
                hashData.append(entry.getKey()).append("=")
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
                first = false;
            }

            // Tạo secure hash
            String secureHash = hmacSha512(vnpHashSecret, hashData.toString());

            log.info("Hash data: {}", hashData.toString());
            log.info("Secure hash: {}", secureHash);

            // Tạo query string - CÓ encode URL
            StringBuilder queryString = new StringBuilder();
            first = true;
            for (Map.Entry<String, String> entry : params.entrySet()) {
                if (!first) {
                    queryString.append("&");
                }
                queryString.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                        .append("=")
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
                first = false;
            }

            // Thêm secure hash vào cuối
            queryString.append("&vnp_SecureHash=").append(secureHash);

            String paymentUrl = vnpUrl + "?" + queryString.toString();
            log.info("VNPay payment URL created: {}", paymentUrl);

            return paymentUrl;

        } catch (Exception e) {
            log.error("Error creating VNPay payment URL: ", e);
            throw new RuntimeException("Error creating payment URL", e);
        }
    }

    @Override
    public boolean verifyPaymentResponse(Map<String, String> params) {
        log.info("Verifying VNPay payment response");
        log.info("Received params: {}", params);

        try {
            String receivedHash = params.get("vnp_SecureHash");
            if (receivedHash == null || receivedHash.isEmpty()) {
                log.error("Missing vnp_SecureHash in response");
                return false;
            }

            // Tạo bản copy và loại bỏ các tham số không cần thiết
            Map<String, String> sortedParams = new TreeMap<>();
            for (Map.Entry<String, String> entry : params.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                // Bỏ qua các tham số hash và các tham số rỗng
                if (!key.equals("vnp_SecureHash") &&
                        !key.equals("vnp_SecureHashType") &&
                        value != null && !value.isEmpty()) {
                    sortedParams.put(key, value);
                }
            }

            // Tạo hash data để verify - CÓ encode URL
            StringBuilder hashData = new StringBuilder();
            boolean first = true;
            for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
                if (!first) {
                    hashData.append("&");
                }
                hashData.append(entry.getKey()).append("=")
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
                first = false;
            }

            // Tính toán hash
            String calculatedHash = hmacSha512(vnpHashSecret, hashData.toString());

            log.info("Hash data for verification: {}", hashData.toString());
            log.info("Received hash: {}", receivedHash);
            log.info("Calculated hash: {}", calculatedHash);

            // So sánh hash (không phân biệt hoa thường)
            boolean hashValid = calculatedHash.equalsIgnoreCase(receivedHash);

            // Kiểm tra response code
            String responseCode = params.get("vnp_ResponseCode");
            boolean paymentSuccess = "00".equals(responseCode);

            log.info("Hash valid: {}, Payment success: {}, Response code: {}",
                    hashValid, paymentSuccess, responseCode);

            return hashValid && paymentSuccess;

        } catch (Exception e) {
            log.error("Error verifying VNPay response: ", e);
            return false;
        }
    }

    private String hmacSha512(String key, String data) throws Exception {
        try {
            if (key == null || key.isEmpty()) {
                throw new IllegalArgumentException("Hash secret cannot be empty");
            }

            Mac sha512Hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            sha512Hmac.init(keySpec);
            byte[] hmacBytes = sha512Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // Convert to hex string
            StringBuilder result = new StringBuilder();
            for (byte b : hmacBytes) {
                result.append(String.format("%02x", b));
            }
            return result.toString();

        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            log.error("Error creating HMAC SHA512: ", e);
            throw new Exception("Error creating HMAC SHA512", e);
        }
    }
}
