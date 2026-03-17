package com.electronics.user.service;

import com.electronics.user.model.User;
import com.electronics.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @org.springframework.transaction.annotation.Transactional
    public User register(User user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new RuntimeException("Username is required");
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (user.getEmail() != null && !user.getEmail().isBlank() && userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (user.getPhone() != null && !user.getPhone().isBlank() && userRepository.findByPhone(user.getPhone()).isPresent()) {
            throw new RuntimeException("Phone number already exists");
        }
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER"); 
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> login(String loginKey, String password) {
        Optional<User> user = userRepository.findByUsername(loginKey);
        if (user.isEmpty()) {
            user = userRepository.findByEmail(loginKey);
        }
        if (user.isEmpty()) {
            user = userRepository.findByPhone(loginKey);
        }
        return user.filter(u -> passwordEncoder.matches(password, u.getPassword()));
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findUserByAnyKey(String key) {
        Optional<User> user = userRepository.findByUsername(key);
        if (user.isEmpty()) user = userRepository.findByEmail(key);
        if (user.isEmpty()) user = userRepository.findByPhone(key);
        return user;
    }

    public String getEmailOfUser(String key) {
        return findUserByAnyKey(key).map(User::getEmail).orElse(key.contains("@") ? key : null);
    }

    @org.springframework.transaction.annotation.Transactional
    public User update(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            if (updatedUser.getFullName() != null) user.setFullName(updatedUser.getFullName());
            if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
            if (updatedUser.getAddress() != null) user.setAddress(updatedUser.getAddress());
            if (updatedUser.getRole() != null) user.setRole(updatedUser.getRole());
            
            if (updatedUser.getUsername() != null && !updatedUser.getUsername().equals(user.getUsername())) {
                if (userRepository.findByUsername(updatedUser.getUsername()).isPresent()) {
                    throw new RuntimeException("Username '" + updatedUser.getUsername() + "' is already taken");
                }
                user.setUsername(updatedUser.getUsername());
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User processOAuthPostLogin(String email, String name) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(email);
                    newUser.setEmail(email);
                    newUser.setFullName(name);
                    newUser.setPassword(""); // No password for OAuth users
                    return userRepository.save(newUser);
                });
    }

    /** Update a user's password securely. */
    public void updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Register a user but preserve the role already set on the object (e.g. ADMIN).
     */
    public User registerAdmin(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent())
            return null;
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /** Admin: list all users. */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /** Admin: delete user by id. */
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
