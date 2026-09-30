package com.crimedetector.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** newPassword is optional; leave it null or omit it to keep the current password. */
public record UpdateUserRequest(
        @NotBlank(message = "Name is required.") @Size(max = 100, message = "Name must be 100 characters or fewer.") String name,
        @NotBlank(message = "Email is required.") @Email(message = "Enter a valid email address.") String email,
        @Size(min = 8, max = 72, message = "Password must be 8 to 72 characters.") String newPassword) {
}
