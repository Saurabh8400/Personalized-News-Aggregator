# 📰 Pulse — Personalized News Aggregator

A full-stack news aggregator with Spring Boot backend and React frontend, featuring JWT auth, Redis caching, rate limiting, and personalized news feeds.

---

## 🏗️ Architecture

```
news-aggregator/
├── backend/          # Spring Boot API (Java 17)
│   └── src/main/java/com/newsagg/
│       ├── config/       # Security, Redis, Web, CORS
│       ├── controller/   # REST endpoints
│       ├── dto/          # Data Transfer Objects
│       ├── entity/       # JPA entities
│       ├── filter/       # JWT + Rate Limit filters
│       ├── repository/   # Spring Data JPA repos
│       ├── security/     # JWT utils & UserDetailsService
│       └── service/      # Business logic
└── frontend/         # React + Vite
    └── src/
        ├── components/   # Reusable UI components
        ├── context/      # Auth context
        ├── pages/        # Route pages
        └── services/     # API service layer
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- Redis (optional — falls back to in-memory if unavailable)
- NewsAPI key (optional — uses mock data if not provided)

### Backend Setup

```bash
cd backend

# Run with default settings (H2 in-memory DB, mock news data)
mvn spring-boot:run

# Run with real NewsAPI key
NEWS_API_KEY=your_key_here mvn spring-boot:run

# Run with Redis
REDIS_HOST=localhost REDIS_PORT=6379 mvn spring-boot:run
```

Backend starts at **http://localhost:8080**

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:5173**

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT token |

### News (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news/headlines` | Top headlines (public) |
| GET | `/api/news/feed` | Personalized feed |
| GET | `/api/news/search?q=query` | Search articles |
| GET | `/api/news/category/{cat}` | News by category |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/preferences` | Get preferences |
| PUT | `/api/user/preferences` | Update preferences |
| POST | `/api/user/saved` | Save article |
| GET | `/api/user/saved` | Get saved articles |
| DELETE | `/api/user/saved?url=...` | Remove saved article |

### Example Requests

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret123"}'

# Get personalized feed (use token from login)
curl http://localhost:8080/api/news/feed \
  -H "Authorization: Bearer <TOKEN>"
```

---

## ⚙️ Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# NewsAPI (get free key at newsapi.org)
app.newsapi.key=your_api_key_here

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# JWT (change in production!)
app.jwt.secret=your_very_long_secret_key_here
app.jwt.expiration=86400000   # 24 hours

# Rate Limiting
app.rate-limit.capacity=30           # Max requests
app.rate-limit.refill-tokens=30      # Tokens per window
app.rate-limit.refill-duration=60    # Window in seconds

# Cache TTL
app.cache.news-ttl=300       # 5 min
app.cache.headlines-ttl=120  # 2 min
```

---

## 🛠️ Key Technologies

| Layer | Technology |
|-------|-----------|
| Backend Framework | Spring Boot 3.2 |
| Security | Spring Security + JWT (JJWT 0.12) |
| Database | H2 (dev) / configurable |
| Caching | Redis + Spring Cache |
| Rate Limiting | Bucket4j (token bucket algorithm) |
| ORM | Spring Data JPA / Hibernate |
| HTTP Client | Spring RestTemplate |
| External News | NewsAPI.org |
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| HTTP | Axios |
| Styling | CSS Modules |

---

## 🔒 Security Features

- **JWT Authentication** — stateless token-based auth, 24h expiry
- **BCrypt Password Hashing** — industry-standard password storage
- **Rate Limiting** — Bucket4j token bucket, 30 req/min per user/IP
- **CORS** — configured for localhost dev origins
- **Method Security** — `@EnableMethodSecurity` for fine-grained control

---

## 📦 Building for Production

```bash
# Backend JAR
cd backend && mvn clean package -DskipTests
java -jar target/news-aggregator-1.0.0.jar

# Frontend build
cd frontend && npm run build
# Serve dist/ with nginx or any static server
```

---

## 🗒️ Notes

- Without a NewsAPI key, the app uses **mock data** (15 realistic articles per request)
- Without Redis, **in-memory rate limiting** is used (resets on restart)
- H2 console available at `http://localhost:8080/h2-console` (dev only)
- Get a free NewsAPI key at [newsapi.org](https://newsapi.org) (100 req/day free tier)
