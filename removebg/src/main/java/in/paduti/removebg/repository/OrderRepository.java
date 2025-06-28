package in.paduti.removebg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import in.paduti.removebg.entity.OrderEntity;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Optional<OrderEntity> findByOrderId(String orderId);
    // OrderEntity findByClerkId(String clerkId);
    // OrderEntity findByPlan(String plan);
    // OrderEntity findByPayment(Boolean payment);

}
