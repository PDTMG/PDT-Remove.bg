package in.paduti.removebg.service;

import java.util.Map;

public interface VnPayService {
    String createPaymentUrl(String orderId, double amount, String ipAddress, String returnUrl);

    boolean verifyPaymentResponse(Map<String, String> params);
}
