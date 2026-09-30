package com.crimedetector.dto;

import com.crimedetector.model.CrimeType;
import com.crimedetector.model.ReportStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;

public record ReportRequest(
        @NotNull(message = "Choose a crime type.") CrimeType crimeType,
        @NotBlank(message = "Description is required.") @Size(max = 2000, message = "Description must be 2000 characters or fewer.") String description,
        @NotBlank(message = "Location is required.") @Size(max = 300, message = "Location must be 300 characters or fewer.") String location,
        @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90.") @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90.") Double latitude,
        @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180.") @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180.") Double longitude,
        @NotNull(message = "Date is required.") @PastOrPresent(message = "Date cannot be in the future.") LocalDate date,
        @NotNull(message = "Time is required.") LocalTime time,
        /** Optional. Only used when updating; new reports always start as SUBMITTED. */
        ReportStatus status) {
}
