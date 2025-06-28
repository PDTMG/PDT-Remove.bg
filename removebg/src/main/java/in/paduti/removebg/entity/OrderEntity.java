package in.paduti.removebg.entity;

import java.security.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_orders")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String orderId;
    private String clerkId;
    private String plan;
    private Double amount;
    private Integer credits;
    private Boolean payment;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Timestamp createdAt;

    @PrePersist
    public void prePersist() {
        if (payment == null) {
            payment = false;
        }
    }
}
