# 🚀 Setup Guide - Pulse News Aggregator

## Prerequisites

- **Java 17+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.8+** ([Download](https://maven.apache.org/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Redis 7+** ([Download](https://redis.io/) or use Docker)
- **Docker & Docker Compose** (Optional, for containerized setup)

## 1. Environment Setup

### Clone the repository
```bash
git clone <repository-url>
cd news-aggregator
```

### Create environment file
```bash
cp .env.example .env
```

### Update `.env` with your values
```env
REDIS_HOST=localhost
REDIS_PORT=6379
NEWS_API_KEY=your_newsapi_key_here  # Get from https://newsapi.org/
JWT_SECRET=your_secure_secret_key
```

## 2. Backend Setup

### Install Maven dependencies
```bash
cd backend
mvn clean install
```

### Configure Redis (if running locally)
```bash
# Using Docker
docker run --name news-redis -d -p 6379:6379 redis:7-alpine

# Or install Redis locally and start it
redis-server
```

### Run the backend
```bash
# Using Maven
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/news-aggregator-1.0.0.jar
```

The backend will start on `http://localhost:8080`

### Access H2 Console (for debugging)
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:newsdb`
- Username: `sa`
- Password: `password`

## 3. Frontend Setup

### Install dependencies
```bash
cd frontend
npm install
```

### Start development server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 4. Using Docker Compose (Recommended)

### Build and start all services
```bash
docker-compose up -d
```

This will start:
- Redis on `localhost:6379`
- Backend on `localhost:8080`
- Frontend on `localhost:3000`

### Stop services
```bash
docker-compose down
```

## 5. Testing the Application

### Create an account
1. Navigate to `http://localhost:5173/register` (or `http://localhost:3000`)
2. Create a new account with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`

### Login
Use your credentials to login

### Explore features
- **My Feed**: View personalized news based on your preferences
- **Explore**: Browse news by category
- **Saved**: Save articles for later reading
- **Preferences**: Customize your news preferences (categories, language, country)

## 6. API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### News
- `GET /api/news/headlines` - Get top headlines
- `GET /api/news/feed` - Get personalized feed
- `GET /api/news/search?q=query` - Search news
- `GET /api/news/category/{category}` - Get news by category

### User
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update preferences
- `GET /api/user/saved` - Get saved articles
- `POST /api/user/saved` - Save article
- `DELETE /api/user/saved?url=...` - Remove saved article

## 7. Troubleshooting

### Redis Connection Error
```
Error: Unable to connect to Redis
Solution: Ensure Redis is running on localhost:6379
- Check: redis-cli ping
- Should return: PONG
```

### Frontend proxy error
```
Error: Cannot proxy to backend
Solution: Ensure backend is running on http://localhost:8080
- Check: curl http://localhost:8080/actuator/health
```

### Port already in use
```
# Change backend port
SERVER_PORT=8081 mvn spring-boot:run

# Change frontend port
npm run dev -- --port 5174
```

### Build errors in Maven
```bash
# Clean and rebuild
mvn clean -U install

# Check Java version
java -version
# Should be 17 or higher
```

## 8. Development Tips

### Backend Hot Reload
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.devtools.restart.enabled=true"
```

### Frontend Hot Module Replacement
Vite automatically refreshes on file changes

### Database Reset
Delete the in-memory H2 database by restarting the backend

## 9. Production Deployment

### Backend
```bash
mvn clean package -DskipTests
java -jar target/news-aggregator-1.0.0.jar
```

### Frontend
```bash
npm run build
# Serve the dist/ folder with a web server
```

### Docker
```bash
docker build -t news-aggregator-backend ./backend
docker build -t news-aggregator-frontend ./frontend
docker-compose -f docker-compose.prod.yml up -d
```

## 10. Getting NewsAPI Key

1. Visit [newsapi.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key
4. Add to your `.env` file

Without a valid NewsAPI key, the app will use mock data.

## Support

For issues or questions:
1. Check the README.md
2. Review application logs
3. Check backend logs: `tail -f backend.log`
4. Check frontend console: Browser DevTools > Console
