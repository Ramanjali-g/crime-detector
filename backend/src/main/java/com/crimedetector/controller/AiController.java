package com.crimedetector.controller;

import com.crimedetector.dto.AiSuggestion;
import com.crimedetector.dto.AiSuggestionRequest;
import com.crimedetector.service.AiService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/suggest-category")
    public AiSuggestion suggest(@Valid @RequestBody AiSuggestionRequest request) {
        return aiService.suggest(request.description());
    }
}
