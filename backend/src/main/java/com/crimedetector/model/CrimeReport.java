package com.crimedetector.model;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "crime_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrimeReport {
    @Id
    private String id;
    @Indexed
    private String userId;
    private CrimeType crimeType;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
    private LocalDate date;
    private LocalTime time;
    private String imageUrl;
    private ReportStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
