package com.crimedetector.config;

import com.crimedetector.model.CrimeReport;
import com.crimedetector.model.CrimeType;
import com.crimedetector.model.EmergencyContact;
import com.crimedetector.model.ReportStatus;
import com.crimedetector.model.User;
import com.crimedetector.repository.CrimeReportRepository;
import com.crimedetector.repository.EmergencyContactRepository;
import com.crimedetector.repository.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Optional demo data. Runs only when SEED_DEMO_PASSWORD is set.
 * Everything it creates is labelled as sample data and is not real crime data.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String DEMO_EMAIL = "demo@example.com";

    private final UserRepository users;
    private final CrimeReportRepository reports;
    private final EmergencyContactRepository contacts;
    private final PasswordEncoder encoder;
    private final String demoPassword;

    public DataSeeder(UserRepository users, CrimeReportRepository reports, EmergencyContactRepository contacts,
                      PasswordEncoder encoder, @Value("${app.seed.demo-password:}") String demoPassword) {
        this.users = users;
        this.reports = reports;
        this.contacts = contacts;
        this.encoder = encoder;
        this.demoPassword = demoPassword;
    }

    @Override
    public void run(String... args) {
        if (demoPassword == null || demoPassword.isBlank() || users.existsByEmail(DEMO_EMAIL)) {
            return;
        }
        Instant now = Instant.now();
        User user = users.save(User.builder().name("Demo Student").email(DEMO_EMAIL)
                .password(encoder.encode(demoPassword)).createdAt(now).updatedAt(now).build());

        reports.save(sample(user.getId(), CrimeType.THEFT, "Sample library entrance", ReportStatus.SUBMITTED,
                "[SAMPLE DATA] Example: a bag was taken from a study table.", now));
        reports.save(sample(user.getId(), CrimeType.VANDALISM, "Sample bike stand", ReportStatus.UNDER_REVIEW,
                "[SAMPLE DATA] Example: a bicycle lock was damaged.", now));
        reports.save(sample(user.getId(), CrimeType.CYBERCRIME, "Online", ReportStatus.RESOLVED,
                "[SAMPLE DATA] Example: a phishing email asked for a campus login.", now));
        contacts.save(EmergencyContact.builder().userId(user.getId()).name("Sample Contact")
                .phone("+00 000 000 0000").relationship("Friend").createdAt(now).build());
        log.info("Seeded demo user {} with sample data.", DEMO_EMAIL);
    }

    private CrimeReport sample(String userId, CrimeType type, String location, ReportStatus status,
                               String description, Instant now) {
        return CrimeReport.builder().userId(userId).crimeType(type).description(description).location(location)
                .date(LocalDate.now().minusDays(3)).time(LocalTime.of(16, 30)).status(status)
                .createdAt(now).updatedAt(now).build();
    }
}
