package com.crimedetector.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank(message = "Contact name is required.") @Size(max = 100, message = "Name must be 100 characters or fewer.") String name,
        @NotBlank(message = "Phone number is required.") @Pattern(regexp = "^[+0-9()\\-\\s]{6,20}$", message = "Enter a valid phone number.") String phone,
        @NotBlank(message = "Relationship is required.") @Size(max = 60, message = "Relationship must be 60 characters or fewer.") String relationship) {
}
