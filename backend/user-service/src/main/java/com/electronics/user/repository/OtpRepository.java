package com.electronics.user.repository;

import com.electronics.user.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByLoginKeyAndCode(String loginKey, String code);
    void deleteByLoginKey(String loginKey);
}
