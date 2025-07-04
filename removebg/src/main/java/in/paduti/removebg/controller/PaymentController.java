package in.paduti.removebg.controller;

import in.paduti.removebg.entity.OrderEntity;
import in.paduti.removebg.entity.UserEntity;
import in.paduti.removebg.repository.OrderRepository;
import in.paduti.removebg.repository.userRepository;
import in.paduti.removebg.service.VnPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final VnPayService vnPayService;
    private final OrderRepository orderRepository;
    private final userRepository userRepository;

    @GetMapping("/create")
    public ResponseEntity<?> createPaymentUrl(
            @RequestParam String orderId,
            @RequestParam double amount,
            @RequestParam(required = false) String successUrl,
            @RequestParam(required = false) String cancelUrl,
            @RequestParam(required = false) String failUrl,
            HttpServletRequest request,
            Authentication authentication) {

        log.info("=== CREATE PAYMENT URL ===");
        log.info("User: {}", authentication.getName());
        log.info("Order ID: {}", orderId);
        log.info("Amount: {}", amount);
        log.info("Success URL: {}", successUrl);

        try {
            // Kiểm tra đơn hàng tồn tại
            Optional<OrderEntity> orderOpt = orderRepository.findByOrderId(orderId);
            if (!orderOpt.isPresent()) {
                log.error("Order not found: {}", orderId);
                return ResponseEntity.badRequest().body("Không tìm thấy đơn hàng với mã: " + orderId);
            }

            OrderEntity order = orderOpt.get();

            // Kiểm tra order thuộc về user hiện tại
            String currentUserId = authentication.getName();
            if (!order.getClerkId().equals(currentUserId)) {
                log.error("Order {} does not belong to user {}", orderId, currentUserId);
                return ResponseEntity.status(403).body("Không có quyền truy cập đơn hàng này");
            }

            // Kiểm tra trạng thái thanh toán
            if (order.getPayment() != null && order.getPayment().equals("PAID")) {
                return ResponseEntity.badRequest().body("Đơn hàng đã được thanh toán");
            }

            // Kiểm tra số tiền
            if (Math.abs(order.getAmount() - amount) > 0.01) {
                log.error("Amount mismatch. Order: {}, Request: {}", order.getAmount(), amount);
                return ResponseEntity.badRequest().body("Số tiền không khớp với đơn hàng");
            }

            // Lấy địa chỉ IP của client
            String ipAddress = getClientIpAddress(request);

            // Sử dụng successUrl nếu có, nếu không dùng default return URL
            String returnUrl = successUrl != null ? successUrl : "http://localhost:8080/api/payment/vnpay-return";

            log.info("Creating payment URL with return URL: {}", returnUrl);

            String paymentUrl = vnPayService.createPaymentUrl(orderId, amount, ipAddress, returnUrl);

            log.info("Payment URL created successfully");

            // Trả về URL trực tiếp như string
            return ResponseEntity.ok(paymentUrl);

        } catch (Exception e) {
            log.error("Error creating payment URL: ", e);
            return ResponseEntity.status(500).body("Lỗi khi tạo URL thanh toán: " + e.getMessage());
        }
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> handleVnpayReturn(HttpServletRequest request) {
        log.info("=== VNPAY RETURN CALLBACK ===");

        try {
            Map<String, String> params = new HashMap<>();
            for (Map.Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
                params.put(entry.getKey(), entry.getValue()[0]);
            }

            log.info("VNPay callback params: {}", params);

            boolean isValid = vnPayService.verifyPaymentResponse(params);
            String orderId = params.get("vnp_TxnRef");
            String responseCode = params.get("vnp_ResponseCode");

            log.info("Payment verification - Valid: {}, OrderId: {}, ResponseCode: {}",
                    isValid, orderId, responseCode);

            Optional<OrderEntity> orderOpt = orderRepository.findByOrderId(orderId);
            if (!orderOpt.isPresent()) {
                log.error("Order not found in callback: {}", orderId);
                return ResponseEntity.badRequest().body("Không tìm thấy đơn hàng với mã: " + orderId);
            }

            OrderEntity order = orderOpt.get();

            if (isValid && "00".equals(responseCode)) {
                // Thanh toán thành công
                order.setPayment(true);
                orderRepository.save(order);

                // Cộng credits cho người dùng
                addCreditsToUser(order.getClerkId(), order.getCredits());

                log.info("Thanh toán thành công cho đơn hàng: {}", orderId);

                String redirectUrl = "http://localhost:5173?status=success&orderId=" + orderId;
                return ResponseEntity.status(302)
                        .header("Location", redirectUrl)
                        .body("Đang chuyển hướng đến trang thành công...");
            } else {
                log.error("Thanh toán thất bại - OrderId: {}, ResponseCode: {}", orderId, responseCode);
                String redirectUrl = "http://localhost:5173?status=failed&orderId=" + orderId;
                return ResponseEntity.status(302)
                        .header("Location", redirectUrl)
                        .body("Đang chuyển hướng đến trang thất bại...");
            }

        } catch (Exception e) {
            log.error("Lỗi xử lý callback VNPay: ", e);
            String redirectUrl = "http://localhost:5173?status=error";
            return ResponseEntity.status(302)
                    .header("Location", redirectUrl)
                    .body("Đang chuyển hướng đến trang lỗi...");
        }
    }

    @RequestMapping(value = "/vnpay-ipn", method = { RequestMethod.GET, RequestMethod.POST })
    public ResponseEntity<Map<String, String>> vnpayIPN(HttpServletRequest request) {
        log.info("=== VNPAY IPN CALLBACK ===");
        log.info("Request method: {}", request.getMethod());

        try {
            Map<String, String> params = new HashMap<>();
            request.getParameterMap().forEach((key, values) -> {
                if (values.length > 0) {
                    params.put(key, values[0]);
                    log.debug("IPN param: {} = {}", key, values[0]);
                }
            });

            boolean isValid = vnPayService.verifyPaymentResponse(params);
            String orderId = params.get("vnp_TxnRef");
            String responseCode = params.get("vnp_ResponseCode");

            if (isValid && "00".equals(responseCode)) {
                log.info("Xác minh IPN thành công cho orderId: {}", orderId);

                Optional<OrderEntity> orderOpt = orderRepository.findByOrderId(orderId);
                if (orderOpt.isPresent()) {
                    OrderEntity order = orderOpt.get();
                    if (!"PAID".equals(order.getPayment())) {
                        order.setPayment(true);
                        orderRepository.save(order);

                        // Cộng credits cho người dùng
                        addCreditsToUser(order.getClerkId(), order.getCredits());

                        log.info("Đơn hàng {} được cập nhật thành PAID qua IPN", orderId);
                    }
                }

                Map<String, String> ipnResponse = new HashMap<>();
                ipnResponse.put("RspCode", "00");
                ipnResponse.put("Message", "Xác nhận thành công");
                return ResponseEntity.ok(ipnResponse);
            } else {
                log.warn("Xác minh IPN thất bại: orderId={}, responseCode={}", orderId, responseCode);
                Map<String, String> ipnResponse = new HashMap<>();
                ipnResponse.put("RspCode", "97");
                ipnResponse.put("Message", "Kiểm tra checksum thất bại");
                return ResponseEntity.ok(ipnResponse);
            }
        } catch (Exception e) {
            log.error("Lỗi xử lý IPN VNPay", e);
            Map<String, String> ipnResponse = new HashMap<>();
            ipnResponse.put("RspCode", "99");
            ipnResponse.put("Message", "Lỗi không xác định: " + e.getMessage());
            return ResponseEntity.ok(ipnResponse);
        }
    }

    private void addCreditsToUser(String clerkId, Integer creditsToAdd) {
        try {
            Optional<UserEntity> userOpt = userRepository.findByClerkId(clerkId);
            if (userOpt.isPresent()) {
                UserEntity user = userOpt.get();
                Integer currentCredits = user.getCredits() != null ? user.getCredits() : 0;
                user.setCredits(currentCredits + creditsToAdd);
                userRepository.save(user);

                log.info("Successfully added {} credits to user {}. New balance: {}",
                        creditsToAdd, clerkId, user.getCredits());
            } else {
                log.error("User not found when trying to add credits: {}", clerkId);
            }
        } catch (Exception e) {
            log.error("Error adding credits to user {}: {}", clerkId, e.getMessage(), e);
        }
    }

    // Helper method để lấy IP address
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        String remoteAddr = request.getRemoteAddr();
        return remoteAddr != null && !remoteAddr.isEmpty() ? remoteAddr : "127.0.0.1";
    }

}
