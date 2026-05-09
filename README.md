# ⚡ Pulse — News Aggregator

A full-stack personalized news aggregator built with **Spring Boot** (Java) and **React**. Users can register, log in, browse top headlines, search news by topic, save articles, and set content preferences.

![Java](https://img.shields.io/badge/Java-17+-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)

---

## ✨ Features

- 🔐 **JWT Authentication** — Register, login, and secure sessions
- 📰 **Live News Feed** — Top headlines powered by NewsAPI
- 🔍 **Search** — Search articles by keyword
- 🏷️ **Categories** — Browse by technology, sports, business, health, and more
- 💾 **Save Articles** — Bookmark articles to read later
- ⚙️ **Preferences** — Personalize your feed by category, country, and language
- ⚡ **Caching** — Redis caching with automatic in-memory fallback
- 🛡️ **Rate Limiting** — Per-user and per-IP rate limiting on news endpoints

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, CSS Modules |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Database | H2 (in-memory, dev) |
| Cache | Redis (optional) with in-memory fallback |
| Auth | JWT (jjwt 0.12) |
| News Data | [NewsAPI.org](https://newsapi.org) |

---

## 📁 Project Structure

```
news-aggregator/
├── backend/                        # Spring Boot API
│   └── src/main/java/com/newsagg/
│       ├── config/                 # Security, Redis, CORS, Rate limit config
│       ├── controller/             # REST controllers (Auth, News, User)
│       ├── dto/                    # Request/Response data transfer objects
│       ├── entity/                 # JPA entities (User, SavedArticle)
│       ├── filter/                 # JWT auth filter, Rate limit filter
│       ├── repository/             # Spring Data JPA repositories
│       ├── security/               # JWT utils, UserDetailsService
│       └── service/                # Business logic (UserService, NewsApiService)
├── frontend/                       # React + Vite app
│   └── src/
│       ├── components/             # Reusable UI components
│       ├── context/                # AuthContext (global auth state)
│       ├── pages/                  # Login, Register, Dashboard, Saved, Preferences
│       └── services/               # Axios API client
├── .env.example                    # Environment variable template
├── FIXES.md                        # Bug fixes applied
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** — [Download](https://adoptium.net)
- **Node.js 18+** — [Download](https://nodejs.org)
- **NewsAPI Key** (free) — [Get one](https://newsapi.org/register)
- **Redis** (optional) — [Install](https://redis.io/docs/install) — app works without it

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

### 2. Configure Environment

Copy the example env file and add your NewsAPI key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
NEWS_API_KEY=your_newsapi_key_here
JWT_SECRET=bXlTdXBlclNlY3JldEtleUZvck5ld3NBZ2dyZWdhdG9yQXBwMTIzNDU2Nzg5MA==
```

### 3. Run the Backend

```bash
cd backend
./mvnw spring-boot:run        # macOS / Linux
mvnw.cmd spring-boot:run      # Windows
```

Backend starts at **http://localhost:8080**

### 4. Run the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:5173**

### 5. Open the App

Go to **http://localhost:5173** in your browser, register a new account, and start exploring.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

### News
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/news/headlines` | Get top headlines | No |
| GET | `/api/news/search?q={query}` | Search articles | Yes |
| GET | `/api/news/category/{category}` | News by category | Yes |

### User
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/user/preferences` | Get user preferences | Yes |
| PUT | `/api/user/preferences` | Update preferences | Yes |
| GET | `/api/user/saved` | Get saved articles | Yes |
| POST | `/api/user/saved` | Save an article | Yes |
| DELETE | `/api/user/saved` | Remove saved article | Yes |

---

## ⚙️ Configuration

All configuration is in `backend/src/main/resources/application.properties` and can be overridden via environment variables.

| Property | Env Variable | Default | Description |
|---|---|---|---|
| `app.jwt.secret` | `JWT_SECRET` | (set in .env) | Base64-encoded JWT signing key |
| `app.newsapi.key` | `NEWS_API_KEY` | `demo_key_replace_with_real` | Your NewsAPI key |
| `spring.data.redis.host` | `REDIS_HOST` | `localhost` | Redis host |
| `spring.data.redis.port` | `REDIS_PORT` | `6379` | Redis port |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `./mvnw: Permission denied` | Run `chmod +x mvnw` in the backend folder |
| Port 8080 already in use | Change `server.port=8081` in `application.properties` |
| Frontend shows "Network Error" | Ensure the backend is running before starting the frontend |
| Login/register returns 500 | Check that `JWT_SECRET` in `.env` is a valid Base64 string |
| No news articles showing | Add a valid `NEWS_API_KEY` to your `.env` file |

---

## 📄 License

MIT License — feel free to use this project for learning or as a starter template.
