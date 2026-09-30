# Crime Detector

A student-level safety and incident-reporting web app (academic prototype).

> **Disclaimer:** Crime Detector is NOT a police, emergency, or official crime-reporting service.
> Reports are stored only in this app's own database and are never sent to any authority.
> The SOS screen does not dispatch anyone. In danger, call your local emergency number.

## Overview
Users register, log in, report incidents (type, description, place, date, time, optional photo),
track the app-level status of their reports, manage emergency contacts, capture their browser
location, view (sample) nearby safe places and open an SOS screen that helps them call or text
their own contacts.

## Features
- Register / login with JWT, BCrypt-hashed passwords
- Dashboard with your own report statistics, location, safety info, contacts, SOS
- Report an incident with validation, browser GPS and optional image upload
- My Reports table, Report Details (update status, delete)
- Emergency contacts CRUD
- Safe places page (sample data, provider abstraction ready for a real API)
- SOS page: shows coordinates, `tel:` and `sms:` links to open on your own phone
- Profile and Settings (device-local preferences)
- Placeholder, rule-based "AI" service (no API key needed)

## Technology Stack
React 18, Vite 5, React Router 6, Axios, plain CSS · Java 17, Spring Boot 3.3, Spring Security,
Spring Data MongoDB, jjwt, Maven · MongoDB.

## Architecture
```
React SPA (5173) --Axios + JWT--> Spring Boot REST API (8080) --> MongoDB (crime_detector)
                                        |-> ./uploads (local image storage)
```
Controllers -> services -> repositories. DTOs (records) validate input. A stateless JWT filter
authenticates each request; every query is scoped to the authenticated user's id.

## Project Structure
```
crime-detector/
├── frontend/   (Vite + React app)
├── backend/    (Spring Boot Maven project)
├── .gitignore
├── LICENSE
└── README.md
```

## Prerequisites
JDK 17+, Maven 3.9+, Node.js 18+, MongoDB 6+ (local install or Atlas).

## Installation
```powershell
git clone <your-repo-url> crime-detector
cd crime-detector
```

## MongoDB Setup
Local: install MongoDB Community Server and make sure the service is running
(`Get-Service MongoDB` should show `Running`). The database `crime_detector` and its
collections are created automatically on first write.
Atlas: create a free cluster, add a database user, allow your IP, copy the connection string
and set it as `MONGODB_URI` (include `/crime_detector` as the database name).

## Backend Setup
```powershell
cd backend
Copy-Item .env.example .env
# generate a secret (Windows PowerShell 5.1 and 7):
$b = New-Object byte[] 48; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)
# paste the output as JWT_SECRET in backend\.env
```

## Frontend Setup
```powershell
cd frontend
Copy-Item .env.example .env
npm install
```

## Environment Variables
| File | Variable | Purpose |
|------|----------|---------|
| backend/.env | `MONGODB_URI` | Mongo connection (default `mongodb://localhost:27017/crime_detector`) |
| backend/.env | `JWT_SECRET` | **Required.** At least 32 characters |
| backend/.env | `JWT_EXPIRATION_MINUTES` | Token lifetime (default 120) |
| backend/.env | `FRONTEND_ORIGIN` | Allowed CORS origin(s), comma separated (default `http://localhost:5173`) |
| backend/.env | `UPLOAD_DIR` | Image folder (default `uploads`) |
| backend/.env | `SEED_DEMO_PASSWORD` | Optional. If set, creates `demo@example.com` with clearly labelled sample data |
| frontend/.env | `VITE_API_URL` | Backend URL (default `http://localhost:8080`) |

The backend reads `backend/.env` automatically (run it from the `backend` folder).

## Running the Application
Terminal 1: `cd backend; mvn spring-boot:run` · Terminal 2: `cd frontend; npm run dev`
then open http://localhost:5173. Run backend tests with `mvn test` (no MongoDB needed; repositories are mocked).

## API Endpoints
| Method | Path | Auth |
|--------|------|------|
| POST | /api/auth/register, /api/auth/login | no |
| GET/PUT | /api/users/me | yes |
| POST (multipart: `data` JSON + optional `image`) | /api/reports | yes |
| GET | /api/reports, /api/reports/{id} | yes |
| PUT/DELETE | /api/reports/{id} | yes |
| POST/GET | /api/contacts | yes |
| PUT/DELETE | /api/contacts/{id} | yes |
| POST | /api/ai/suggest-category | yes (keyword rules, no external AI) |

## Screenshots
_Add screenshots here (landing, dashboard, report form, SOS)._

## Future Enhancements
Admin/moderator role for real status changes, Leaflet or a maps API with live nearby-places
lookup (Overpass), cloud image storage, refresh tokens, email verification, an LLM-backed
`AiService`, push notifications.

## Limitations
- Statuses are application-level only; the report owner can change them (there is no admin role).
- Safe places are sample data. No real crime statistics are used or shown.
- Maps use the free OpenStreetMap embed (external dependency: openstreetmap.org, no key).
- Image validation checks extension and content type only, not file contents.
- JWT is kept in `localStorage` (simple, but exposed to XSS).

## Security Notes
BCrypt passwords, stateless JWT, per-user data scoping, input validation, configurable CORS,
generic 500 errors, secrets only via environment. This is a student project and is not
security-audited or production-certified.

## AI feature
`AiService` is an interface with a keyword-based placeholder. It only suggests a category and
a short summary, always with a disclaimer. It never identifies or predicts individuals.

## Disclaimer
Academic prototype. Not a police, emergency, or official crime-reporting system.

## Contributors
Your name here.
