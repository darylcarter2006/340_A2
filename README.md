# Gumball Character API

A RESTful CRUD API for characters from **The Amazing World of Gumball** (the Watterson family and friends from my Assignment 2 character gallery). Built with Spring Boot, Spring Data JPA, and PostgreSQL (Neon), containerized with Docker, and deployed on Render.

## Live API

**Base URL:** _RENDER_URL_PLACEHOLDER_/api/characters

> **Note:** This runs on Render's free tier, which puts the service to sleep when it is idle. The first request after a period of inactivity can take **up to a minute** while the service wakes up. Later requests are fast.

## Character Entity

Table name: `characters`

| Attribute     | Type    | Rules                                   |
|---------------|---------|-----------------------------------------|
| `characterId` | Long    | Unique, auto-generated (ignored if sent in a request body) |
| `name`        | String  | Required (not null, not blank)          |
| `description` | String  | Required (not null, not blank)          |
| `species`     | String  | Optional, e.g. `Cat`, `Goldfish`, `Rabbit` |
| `role`        | String  | Optional, e.g. `Main Character`, `Mom`  |
| `age`         | Integer | Optional, must be 0 or greater          |

## Endpoints

| Method | Path                                   | Description                                         | Success Status |
|--------|----------------------------------------|-----------------------------------------------------|----------------|
| GET    | `/api/characters`                      | Get all characters                                  | 200 OK         |
| GET    | `/api/characters/{id}`                 | Get one character by ID                             | 200 OK         |
| POST   | `/api/characters`                      | Add a character                                     | 201 Created    |
| PUT    | `/api/characters/{id}`                 | Update a character                                  | 200 OK         |
| DELETE | `/api/characters/{id}`                 | Delete a character                                  | 204 No Content |
| GET    | `/api/characters?species=Cat`          | Filter by species (case-insensitive, exact match)   | 200 OK         |
| GET    | `/api/characters?name=wat`             | Search by name (partial, case-insensitive)          | 200 OK         |

If both `species` and `name` are given (e.g. `/api/characters?species=rabbit&name=an`), only characters matching **both** are returned.

### Error responses

| Situation                                              | Status          |
|--------------------------------------------------------|-----------------|
| GET, PUT, or DELETE with an ID that does not exist     | 404 Not Found   |
| POST or PUT with a missing/blank `name` or `description` | 400 Bad Request |

Example 400 response:

```json
{
  "timestamp": "2026-10-13T21:50:46.469",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": { "name": "Name is required" }
}
```

### Example request bodies

**POST** `/api/characters`

```json
{
  "name": "Gumball Watterson",
  "description": "A mischievous 12-year-old cat who lives in Elmore with his family.",
  "species": "Cat",
  "role": "Main Character",
  "age": 12
}
```

**PUT** `/api/characters/1`

```json
{
  "name": "Gumball Watterson",
  "description": "A mischievous 12-year-old cat whose big plans usually end in chaos.",
  "species": "Cat",
  "role": "Main Character",
  "age": 12
}
```

PUT replaces all editable fields, so send the full object.

## Project Structure

```
src/main/java/com/darylcarter/gumball/
├── entity/GumballCharacter.java              # JPA entity (table: characters)
├── repository/GumballCharacterRepository.java # Spring Data JPA repository
├── service/GumballCharacterService.java       # Business logic
├── controller/GumballCharacterController.java # REST endpoints
└── exception/                                 # 404 and validation error handling
```

## Running Locally

Requires JDK 25. Set the database connection string as an environment variable (never commit it), then start the app from the same terminal:

```bash
export SPRING_DATASOURCE_URL="jdbc:postgresql://..."
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080/api/characters`. The `characters` table is created automatically on the first run.

### With Docker

```bash
docker build -t gumball-api .
docker run -p 8080:8080 -e SPRING_DATASOURCE_URL="jdbc:postgresql://..." gumball-api
```
