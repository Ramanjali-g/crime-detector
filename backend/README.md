# Crime Detector: backend

Spring Boot 3 / Java 17 REST API.

```powershell
Copy-Item .env.example .env   # then set JWT_SECRET
mvn spring-boot:run           # http://localhost:8080
mvn test                      # tests mock the repositories, MongoDB not required
```
See the root README for endpoints and environment variables.
