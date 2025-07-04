package in.paduti.removebg.controller;

import java.sql.Timestamp;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import in.paduti.removebg.entity.OrderEntity;
import in.paduti.removebg.repository.OrderRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<OrderEntity> createOrder(
            @RequestBody OrderEntity order,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(403).body(null);
        }

        String clerkId = authentication.getName();

        order.setClerkId(clerkId);
        order.setOrderId(UUID.randomUUID().toString());
        order.setPayment(false);
        order.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        OrderEntity savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

}
