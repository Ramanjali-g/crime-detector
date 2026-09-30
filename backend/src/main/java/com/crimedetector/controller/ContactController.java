package com.crimedetector.controller;

import com.crimedetector.dto.ContactRequest;
import com.crimedetector.model.EmergencyContact;
import com.crimedetector.service.ContactService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<EmergencyContact> create(Principal principal, @Valid @RequestBody ContactRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.create(principal.getName(), request));
    }

    @GetMapping
    public List<EmergencyContact> list(Principal principal) {
        return contactService.list(principal.getName());
    }

    @PutMapping("/{id}")
    public EmergencyContact update(Principal principal, @PathVariable String id, @Valid @RequestBody ContactRequest request) {
        return contactService.update(principal.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Principal principal, @PathVariable String id) {
        contactService.delete(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
