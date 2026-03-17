package com.electronics.user.controller;

import com.electronics.user.config.JwtUtils;
import com.electronics.user.model.AuthResponse;
import com.electronics.user.model.User;
import com.electronics.user.service.GoogleAuthService;
import com.electronics.user.service.OtpService;
import com.electronics.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final OtpService otpService;
    private final GoogleAuthService googleAuthService;
    private final JwtUtils jwtUtils;

    @PostMapping("/auth/google")
    public ResponseEntity<Object> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        return googleAuthService.verifyToken(idToken)
                .map(payload -> {
                    String email = payload.getEmail();
                    String name = (String) payload.get("name");
                    User user = userService.processOAuthPostLogin(email, name);
                    return ResponseEntity.ok((Object) AuthResponse.builder()
                            .accessToken(jwtUtils.generateAccessToken(user.getUsername()))
                            .refreshToken(jwtUtils.generateRefreshToken(user.getUsername()))
                            .user(user)
                            .build());
                })
                .orElse(ResponseEntity.status(401).body((Object) "Invalid Google Token"));
    }

    @PostMapping("/auth/register")
    public ResponseEntity<Object> register(@RequestBody User user) {
        try {
            User savedUser = userService.register(user);
            return ResponseEntity.ok((Object) AuthResponse.builder()
                    .accessToken(jwtUtils.generateAccessToken(savedUser.getUsername()))
                    .refreshToken(jwtUtils.generateRefreshToken(savedUser.getUsername()))
                    .user(savedUser)
                    .build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body((Object) e.getMessage());
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> creds) {
        String loginKey = creds.get("username");
        if (loginKey == null) loginKey = creds.get("email");

        return userService.login(loginKey, creds.get("password"))
                .map(u -> ResponseEntity.ok((Object) AuthResponse.builder()
                        .accessToken(jwtUtils.generateAccessToken(u.getUsername()))
                        .refreshToken(jwtUtils.generateRefreshToken(u.getUsername()))
                        .user(u)
                        .build()))
                .orElse(ResponseEntity.status(401).body((Object) "Invalid username or password"));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<Object> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        try {
            String username = jwtUtils.extractUsername(refreshToken);
            if (jwtUtils.validateToken(refreshToken, username)) {
                String newAccessToken = jwtUtils.generateAccessToken(username);
                return ResponseEntity.ok((Object) Map.of("accessToken", newAccessToken));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body((Object) "Invalid refresh token");
        }
        return ResponseEntity.status(401).body((Object) "Invalid refresh token");
    }

    @PostMapping("/auth/send-otp")
    public ResponseEntity<Object> sendOtp(@RequestParam String loginKey) {
        try {
            otpService.generateOtp(loginKey);
            return ResponseEntity.ok((Object) "OTP sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body((Object) "Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/auth/verify-otp")
    public ResponseEntity<Object> verifyOtp(@RequestParam String loginKey, @RequestParam String code) {
        if (otpService.verifyOtp(loginKey, code)) {
            return userService.findUserByAnyKey(loginKey)
                    .map(u -> {
                        String accessToken = jwtUtils.generateAccessToken(u.getUsername());
                        String refreshToken = jwtUtils.generateRefreshToken(u.getUsername());
                        return ResponseEntity.ok((Object) AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .user(u)
                                .build());
                    })
                    .orElse(ResponseEntity.status(404).body((Object) "User not found"));
        }
        return ResponseEntity.status(401).body((Object) "Invalid or expired OTP");
    }

    @PostMapping("/auth/reset-password")
    public ResponseEntity<Object> resetPassword(
            @RequestParam String loginKey,
            @RequestParam String otp,
            @RequestParam String newPassword) {
        if (!otpService.verifyOtp(loginKey, otp)) {
            return ResponseEntity.status(401).body((Object) "Invalid or expired OTP");
        }
        return userService.findUserByAnyKey(loginKey)
                .map(user -> {
                    userService.updatePassword(user, newPassword);
                    return ResponseEntity.ok((Object) "Password reset successfully");
                })
                .orElse(ResponseEntity.status(404).body((Object) "User not found"));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.update(id, user));
    }

    @GetMapping("/users")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Iterable<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
