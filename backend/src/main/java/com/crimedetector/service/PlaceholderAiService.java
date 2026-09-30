package com.crimedetector.service;

import com.crimedetector.dto.AiSuggestion;
import com.crimedetector.model.CrimeType;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

/** Free, offline, keyword-based stand-in. Replace with an LLM-backed AiService later. */
@Service
public class PlaceholderAiService implements AiService {

    private static final String DISCLAIMER =
            "This is an automatic keyword-based suggestion and may be wrong. Please choose the category yourself.";

    private static final Map<CrimeType, List<String>> KEYWORDS = new LinkedHashMap<>();

    static {
        KEYWORDS.put(CrimeType.BURGLARY, List.of("break-in", "broke into", "burglar", "burglary", "forced entry"));
        KEYWORDS.put(CrimeType.CYBERCRIME, List.of("hacked", "phishing", "malware", "online account", "password", "cyber"));
        KEYWORDS.put(CrimeType.FRAUD, List.of("scam", "fraud", "cheated", "fake", "impersonat"));
        KEYWORDS.put(CrimeType.ASSAULT, List.of("punched", "attacked", "assault", "beaten", "hit me"));
        KEYWORDS.put(CrimeType.HARASSMENT, List.of("harass", "stalk", "followed me", "threat", "bully"));
        KEYWORDS.put(CrimeType.VANDALISM, List.of("vandal", "graffiti", "smashed", "damaged"));
        KEYWORDS.put(CrimeType.THEFT, List.of("stole", "stolen", "theft", "snatch", "pickpocket", "robbed"));
    }

    @Override
    public AiSuggestion suggest(String description) {
        String text = description.toLowerCase(Locale.ROOT);
        CrimeType suggested = CrimeType.OTHER;
        for (Map.Entry<CrimeType, List<String>> entry : KEYWORDS.entrySet()) {
            if (entry.getValue().stream().anyMatch(text::contains)) {
                suggested = entry.getKey();
                break;
            }
        }
        String trimmed = description.trim();
        String summary = trimmed.length() <= 140 ? trimmed : trimmed.substring(0, 137) + "...";
        return new AiSuggestion(suggested, summary, DISCLAIMER);
    }
}
