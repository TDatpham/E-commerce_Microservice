package com.electronics.user.service;

import com.electronics.user.model.Otp;
import com.electronics.user.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {
    private final OtpRepository otpRepository;
    private final JavaMailSender mailSender;
    private final UserService userService;

    @Transactional
    public String generateOtp(String loginKey) {
        otpRepository.deleteByLoginKey(loginKey);

        String code = String.format("%06d", new Random().nextInt(999999));
        Otp otp = Otp.builder()
                .loginKey(loginKey)
                .code(code)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .build();

        otpRepository.save(otp);
        
        String email = userService.getEmailOfUser(loginKey);
        if (email != null && !email.isBlank()) {
            sendOtpEmail(email, code);
        }
        
        return code;
    }

    public boolean verifyOtp(String loginKey, String code) {
        return otpRepository.findByLoginKeyAndCode(loginKey, code)
                .map(otp -> otp.getExpiryTime().isAfter(LocalDateTime.now()))
                .orElse(false);
    }

    private void sendOtpEmail(String email, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your OTP Code");
            message.setText("Your verification code is: " + code);
            mailSender.send(message);
            System.out.println("OTP sent to " + email + ": " + code);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email. Please check server logs or SMTP config.");
        }
    }
}
