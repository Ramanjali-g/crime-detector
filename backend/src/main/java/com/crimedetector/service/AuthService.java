package com.crimedetector.service;

import com.crimedetector.dto.AuthResponse;
import com.crimedetector.dto.LoginRequest;
import com.crimedetector.dto.RegisterRequest;
import com.crimedetector.dto.UserResponse;
import com.crimedetector.exception.ApiException;
import com.crimedetector.model.User;
import com.crimedetector.repository.UserRepository;
import com.crimedetector.security.JwtService;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwtService) {
        this.users = users;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }
        Instant now = Instant.now();
        User saved = users.save(User.builder()
                .name(request.name().trim())
                .email(email)
                .password(encoder.encode(request.password()))
                .createdAt(now)
                .updatedAt(now)
                .build());
        return new AuthResponse(jwtService.generateToken(saved.getId()), UserResponse.from(saved));
    }

    public AuthResponse login(LoginRequest request) {
        User user = users.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(AuthService::invalidCredentials);
        if (!encoder.matches(request.password(), user.getPassword())) {
            throw invalidCredentials();
        }
        return new AuthResponse(jwtService.generateToken(user.getId()), UserResponse.from(user));
    }

    private static ApiException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "Incorrect email or password.");
    }
}
