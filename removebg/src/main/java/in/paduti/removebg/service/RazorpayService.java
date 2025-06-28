package in.paduti.removebg.service;

import com.razorpay.Order;
import com.razorpay.RazorpayException;

public interface RazorpayService {
    Order createOrder(Double amount, String currency) throws RazorpayException;
}
