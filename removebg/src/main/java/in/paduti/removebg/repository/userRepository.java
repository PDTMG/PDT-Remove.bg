package in.paduti.removebg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import in.paduti.removebg.entity.UserEntity;

public interface userRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByClerkId(String clerkId);

    Optional<UserEntity> findByClerkId(String clerkId);

}
