package com.crimedetector.dto;

import com.crimedetector.model.CrimeType;

public record AiSuggestion(CrimeType suggestedType, String summary, String disclaimer) {
}
