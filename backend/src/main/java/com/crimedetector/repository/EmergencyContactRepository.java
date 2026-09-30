package com.crimedetector.repository;

import com.crimedetector.model.EmergencyContact;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmergencyContactRepository extends MongoRepository<EmergencyContact, String> {
    List<EmergencyContact> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<EmergencyContact> findByIdAndUserId(String id, String userId);
}
