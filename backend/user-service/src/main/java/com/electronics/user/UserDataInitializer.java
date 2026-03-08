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

    @Override
    public void run(String... args) {
        if (userService.getUserById(1L).isEmpty()) {
            User user = new User();
            user.setUsername("lily.wastons@gmail.com");
            user.setEmail("lily.wastons@gmail.com");
            user.setPassword("random-password1234");
            user.setFullName("Lily Watson");
            userService.register(user);
            System.out.println("Initialized Lily Watson user.");
        }

        // Create default admin account if not exists
        if (userService.getUserByEmail("admin@electronics.com").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@electronics.com");
            admin.setPassword("Admin@123456");
            admin.setFullName("Administrator");
            admin.setRole("ADMIN");
            userService.registerAdmin(admin);
            System.out.println("Initialized Admin user: admin@electronics.com / Admin@123456");
        }
    }
}
