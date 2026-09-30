package com.crimedetector.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AiSuggestionRequest(
        @NotBlank(message = "Description is required.") @Size(max = 2000, message = "Description is too long.") String description) {
}
