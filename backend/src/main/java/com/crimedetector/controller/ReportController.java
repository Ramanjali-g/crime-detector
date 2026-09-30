package com.crimedetector.controller;

import com.crimedetector.dto.ReportRequest;
import com.crimedetector.model.CrimeReport;
import com.crimedetector.service.ReportService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /** Multipart: part "data" = JSON ReportRequest, optional part "image" = file. */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CrimeReport> create(Principal principal,
                                              @Valid @RequestPart("data") ReportRequest data,
                                              @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.create(principal.getName(), data, image));
    }

    @GetMapping
    public List<CrimeReport> list(Principal principal) {
        return reportService.list(principal.getName());
    }

    @GetMapping("/{id}")
    public CrimeReport get(Principal principal, @PathVariable String id) {
        return reportService.get(principal.getName(), id);
    }

    @PutMapping("/{id}")
    public CrimeReport update(Principal principal, @PathVariable String id, @Valid @RequestBody ReportRequest request) {
        return reportService.update(principal.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Principal principal, @PathVariable String id) {
        reportService.delete(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
