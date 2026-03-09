package com.electronics.user.controller;

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

    @PostMapping("/auth/google")
    public ResponseEntity<Object> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        return googleAuthService.verifyToken(idToken)
                .map(payload -> {
                    String email = payload.getEmail();
                    String name = (String) payload.get("name");
                    return ResponseEntity.ok((Object) userService.processOAuthPostLogin(email, name));
                })
                .orElse(ResponseEntity.status(401).body((Object) "Invalid Google Token"));
    }

    @PostMapping("/auth/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        otpService.generateOtp(email);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/auth/verify-otp")
    public ResponseEntity<Object> verifyOtp(@RequestParam String email, @RequestParam String code) {
        if (otpService.verifyOtp(email, code)) {
            return userService.getUserByEmail(email)
                    .map(u -> ResponseEntity.ok((Object) u))
                    .orElse(ResponseEntity.status(404).body((Object) "User not found"));
        }
        return ResponseEntity.status(401).body((Object) "Invalid or expired OTP");
    }

    @PostMapping("/auth/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {
        if (!otpService.verifyOtp(email, otp)) {
            return ResponseEntity.status(401).body("Invalid or expired OTP");
        }
        return userService.getUserByEmail(email)
                .map(user -> {
                    userService.updatePassword(user, newPassword);
                    return ResponseEntity.ok("Password reset successfully");
                })
                .orElse(ResponseEntity.status(404).body("User not found"));
    }

    @PostMapping("/auth/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.register(user));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> creds) {
        return userService.login(creds.get("username"), creds.get("password"))
                .map(u -> ResponseEntity.ok((Object) u))
                .orElse(ResponseEntity.status(401).body((Object) "Invalid credentials"));
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

    /** Admin: list all users. */
    @GetMapping("/users")
    public ResponseEntity<Iterable<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /** Admin: delete user by id. */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
