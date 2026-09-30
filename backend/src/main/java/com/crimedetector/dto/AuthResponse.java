package com.crimedetector.dto;

public record AuthResponse(String token, UserResponse user) {
}
