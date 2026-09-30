package com.crimedetector;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.crimedetector.model.CrimeReport;
import com.crimedetector.model.User;
import com.crimedetector.repository.CrimeReportRepository;
import com.crimedetector.repository.EmergencyContactRepository;
import com.crimedetector.repository.UserRepository;
import com.crimedetector.security.JwtService;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

/** Repositories are mocked, so these tests run without a MongoDB server. */
@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTest {

    @Autowired MockMvc mvc;
    @Autowired JwtService jwtService;
    @Autowired PasswordEncoder encoder;

    @MockBean UserRepository users;
    @MockBean CrimeReportRepository reports;
    @MockBean EmergencyContactRepository contacts;

    private static final String REPORT_JSON = """
            {"crimeType":"THEFT","description":"Phone stolen near the library entrance.",
             "location":"Main library","latitude":16.5062,"longitude":80.6480,
             "date":"2024-01-15","time":"14:30"}""";

    @Test
    void registerCreatesAccountAndReturnsToken() throws Exception {
        when(users.existsByEmail("ada@example.com")).thenReturn(false);
        when(users.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId("u1");
            return u;
        });

        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Ada\",\"email\":\"Ada@Example.com\",\"password\":\"Password123\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("ada@example.com"))
                .andExpect(jsonPath("$.user.password").doesNotExist());
    }

    @Test
    void registerRejectsDuplicateEmail() throws Exception {
        when(users.existsByEmail("ada@example.com")).thenReturn(true);

        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"password\":\"Password123\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void registerRejectsShortPassword() throws Exception {
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"password\":\"short\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    @Test
    void loginSucceedsWithCorrectPasswordAndFailsWithWrongOne() throws Exception {
        User user = User.builder().id("u1").name("Ada").email("ada@example.com")
                .password(encoder.encode("Password123")).createdAt(Instant.now()).updatedAt(Instant.now()).build();
        when(users.findByEmail("ada@example.com")).thenReturn(Optional.of(user));

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"ada@example.com\",\"password\":\"Password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"ada@example.com\",\"password\":\"WrongPassword\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpointsRequireAuthentication() throws Exception {
        mvc.perform(get("/api/reports")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/contacts")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/users/me")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/reports").header("Authorization", "Bearer not-a-real-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticatedUserCanListReports() throws Exception {
        when(reports.findByUserIdOrderByCreatedAtDesc("u1")).thenReturn(List.of());

        mvc.perform(get("/api/reports").header("Authorization", "Bearer " + jwtService.generateToken("u1")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void authenticatedUserCanCreateReport() throws Exception {
        when(reports.save(any(CrimeReport.class))).thenAnswer(inv -> {
            CrimeReport r = inv.getArgument(0);
            r.setId("r1");
            return r;
        });

        mvc.perform(multipart("/api/reports")
                        .file(new MockMultipartFile("data", "", "application/json", REPORT_JSON.getBytes()))
                        .header("Authorization", "Bearer " + jwtService.generateToken("u1")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("r1"))
                .andExpect(jsonPath("$.userId").value("u1"))
                .andExpect(jsonPath("$.status").value("SUBMITTED"));
    }

    @Test
    void createReportRejectsInvalidInput() throws Exception {
        String invalid = "{\"crimeType\":\"THEFT\",\"description\":\"\",\"location\":\"\",\"date\":\"2024-01-15\",\"time\":\"14:30\"}";

        mvc.perform(multipart("/api/reports")
                        .file(new MockMultipartFile("data", "", "application/json", invalid.getBytes()))
                        .header("Authorization", "Bearer " + jwtService.generateToken("u1")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createReportWithoutTokenIsRejected() throws Exception {
        mvc.perform(multipart("/api/reports")
                        .file(new MockMultipartFile("data", "", "application/json", REPORT_JSON.getBytes())))
                .andExpect(status().isUnauthorized());
    }
}
