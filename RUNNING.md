# ⚡ Quick Start Guide

## 🚀 Fastest Way to Run (Using Docker)

```bash
# 1. Make sure Docker & Docker Compose are installed
docker --version
docker-compose --version

# 2. Create .env file (optional, uses defaults if skipped)
cp .env.example .env

# 3. Start all services
docker-compose up -d

# 4. Wait 10-15 seconds for services to start
# 5. Open browser to http://localhost:3000

# 6. Stop services
docker-compose down
```

---

## 🖥️ Manual Setup (Recommended for Development)

### Step 1: Start Redis
```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# OR if Redis is installed locally
redis-server
```

### Step 2: Start Backend
```bash
cd backend
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

### Step 3: Start Frontend (in a new terminal)
```bash
cd frontend
npm install  # Only needed first time
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 4: Open Application
Navigate to `http://localhost:5173`

---

## 🔓 Default Credentials

Use these to test:
- Username: `testuser`
- Email: `test@example.com`
- Password: `password123`

Or create your own account by registering.

---

## 📝 Available URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | React App (dev) |
| Frontend | http://localhost:3000 | React App (docker) |
| Backend API | http://localhost:8080 | Spring Boot API |
| H2 Console | http://localhost:8080/h2-console | Database viewer |
| Redis | localhost:6379 | Cache server |

---

## 🛠️ Development Commands

```bash
# Backend
mvn clean compile        # Compile Java code
mvn spring-boot:run      # Run backend
mvn test                 # Run tests
mvn clean package        # Build JAR

# Frontend
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview build locally
```

---

## 🐛 Troubleshooting

### Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If not running with Docker
docker run -d -p 6379:6379 redis:7-alpine
```

### Port Already in Use
```bash
# Kill process on port 8080 (backend)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Frontend not connecting to backend
- Check backend is running on http://localhost:8080
- Check browser console for errors (F12)
- Verify CORS is enabled in backend

---

## 📚 Full Documentation

- See [SETUP.md](SETUP.md) for detailed setup instructions
- See [README.md](README.md) for project overview
