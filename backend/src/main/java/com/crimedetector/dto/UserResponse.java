package com.crimedetector.dto;

import com.crimedetector.model.User;
import java.time.Instant;

public record UserResponse(String id, String name, String email, Instant createdAt, Instant updatedAt) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt());
    }
}
