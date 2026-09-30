package com.crimedetector.service;

import com.crimedetector.dto.AiSuggestion;

/**
 * Extension point for future AI features (summaries, category suggestions, safety guidance).
 * Implementations must never identify or predict individuals as criminals, make
 * discriminatory predictions, or present uncertain output as fact.
 */
public interface AiService {
    AiSuggestion suggest(String description);
}
