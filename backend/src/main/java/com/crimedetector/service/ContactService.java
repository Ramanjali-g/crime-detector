package com.crimedetector.service;

import com.crimedetector.dto.ContactRequest;
import com.crimedetector.exception.ApiException;
import com.crimedetector.model.EmergencyContact;
import com.crimedetector.repository.EmergencyContactRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final EmergencyContactRepository contacts;

    public ContactService(EmergencyContactRepository contacts) {
        this.contacts = contacts;
    }

    public EmergencyContact create(String userId, ContactRequest request) {
        return contacts.save(EmergencyContact.builder()
                .userId(userId)
                .name(request.name().trim())
                .phone(request.phone().trim())
                .relationship(request.relationship().trim())
                .createdAt(Instant.now())
                .build());
    }

    public List<EmergencyContact> list(String userId) {
        return contacts.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public EmergencyContact update(String userId, String id, ContactRequest request) {
        EmergencyContact contact = find(userId, id);
        contact.setName(request.name().trim());
        contact.setPhone(request.phone().trim());
        contact.setRelationship(request.relationship().trim());
        return contacts.save(contact);
    }

    public void delete(String userId, String id) {
        contacts.delete(find(userId, id));
    }

    private EmergencyContact find(String userId, String id) {
        return contacts.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Contact not found."));
    }
}
