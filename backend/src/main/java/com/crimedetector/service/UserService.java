package com.crimedetector.service;

import com.crimedetector.dto.UpdateUserRequest;
import com.crimedetector.dto.UserResponse;
import com.crimedetector.exception.ApiException;
import com.crimedetector.model.User;
import com.crimedetector.repository.UserRepository;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public UserService(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    public UserResponse getMe(String userId) {
        return UserResponse.from(find(userId));
    }

    public UserResponse updateMe(String userId, UpdateUserRequest request) {
        User user = find(userId);
        String email = request.email().trim().toLowerCase();
        if (!email.equals(user.getEmail()) && users.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "That email is already used by another account.");
        }
        user.setName(request.name().trim());
        user.setEmail(email);
        if (request.newPassword() != null && !request.newPassword().isBlank()) {
            user.setPassword(encoder.encode(request.newPassword()));
        }
        user.setUpdatedAt(Instant.now());
        return UserResponse.from(users.save(user));
    }

    private User find(String userId) {
        return users.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Account not found. Please log in again."));
    }
}
