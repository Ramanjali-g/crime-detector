package com.crimedetector.service;

import com.crimedetector.dto.ReportRequest;
import com.crimedetector.exception.ApiException;
import com.crimedetector.model.CrimeReport;
import com.crimedetector.model.ReportStatus;
import com.crimedetector.repository.CrimeReportRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ReportService {

    private final CrimeReportRepository reports;
    private final FileStorageService files;

    public ReportService(CrimeReportRepository reports, FileStorageService files) {
        this.reports = reports;
        this.files = files;
    }

    public CrimeReport create(String userId, ReportRequest request, MultipartFile image) {
        Instant now = Instant.now();
        CrimeReport report = CrimeReport.builder()
                .userId(userId)
                .crimeType(request.crimeType())
                .description(request.description().trim())
                .location(request.location().trim())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .date(request.date())
                .time(request.time())
                .imageUrl(files.store(image))
                .status(ReportStatus.SUBMITTED)
                .createdAt(now)
                .updatedAt(now)
                .build();
        return reports.save(report);
    }

    public List<CrimeReport> list(String userId) {
        return reports.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public CrimeReport get(String userId, String id) {
        return reports.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Report not found."));
    }

    public CrimeReport update(String userId, String id, ReportRequest request) {
        CrimeReport report = get(userId, id);
        report.setCrimeType(request.crimeType());
        report.setDescription(request.description().trim());
        report.setLocation(request.location().trim());
        report.setLatitude(request.latitude());
        report.setLongitude(request.longitude());
        report.setDate(request.date());
        report.setTime(request.time());
        if (request.status() != null) {
            report.setStatus(request.status());
        }
        report.setUpdatedAt(Instant.now());
        return reports.save(report);
    }

    public void delete(String userId, String id) {
        CrimeReport report = get(userId, id);
        reports.delete(report);
        files.delete(report.getImageUrl());
    }
}
