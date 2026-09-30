package com.crimedetector.repository;

import com.crimedetector.model.CrimeReport;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CrimeReportRepository extends MongoRepository<CrimeReport, String> {
    List<CrimeReport> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<CrimeReport> findByIdAndUserId(String id, String userId);
}
