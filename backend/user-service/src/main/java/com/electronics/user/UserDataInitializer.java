package com.electronics.user;

import com.electronics.user.model.User;
import com.electronics.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserDataInitializer implements CommandLineRunner {
    private final UserService userService;
    
    @org.springframework.beans.factory.annotation.Value("${admin.password:Admin@123456}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        try {
            // Initializing Lily Watson
            String lilyEmail = "lily.wastons@gmail.com";
            if (userService.getUserByEmail(lilyEmail).isEmpty()) {
                User user = new User();
                user.setUsername(lilyEmail);
                user.setEmail(lilyEmail);
                user.setPassword("random-password1234");
                user.setFullName("Lily Watson");
                user.setRole("USER");
                try {
                    userService.register(user);
                    System.out.println("Initialized Lily Watson user.");
                } catch (Exception e) {
                    System.err.println("Could not register Lily Watson: " + e.getMessage());
                }
            }

            // Create default admin account if not exists
            String adminEmail = "admin@electronics.com";
            if (userService.getUserByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail(adminEmail);
                admin.setPassword(adminPassword);
                admin.setFullName("Administrator");
                admin.setRole("ADMIN");
                try {
                    userService.registerAdmin(admin);
                    System.out.println("Initialized Admin user: " + adminEmail);
                } catch (Exception e) {
                    System.err.println("Could not register Admin: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.err.println("Critical error during UserDataInitializer: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
