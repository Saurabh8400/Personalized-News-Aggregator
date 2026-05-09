# Bug Fixes Applied

## 1. 🔴 CRITICAL — JWT Secret Invalid (Register/Login broken)
**File:** `backend/src/main/resources/application.properties`  
**Problem:** The default `JWT_SECRET` value was a raw hex string. `JwtUtils.key()` calls `Decoders.BASE64.decode()` on it, which throws an `IllegalArgumentException` at runtime, causing every register and login request to fail with a 500 error.  
**Fix:** Replaced with a valid Base64-encoded 256-bit secret.

## 2. 🔴 CRITICAL — App Fails to Start Without Redis (Register/Login impossible)
**File:** `backend/src/main/java/com/newsagg/config/RedisConfig.java`  
**Problem:** The original `RedisConfig` creates Redis beans unconditionally. If Redis is not running locally (common in dev), the Spring context fails to start entirely — so no API endpoint is reachable, including `/api/auth/register` and `/api/auth/login`.  
**Fix:** The `cacheManager` bean now tests the Redis connection first. If Redis is unavailable, it transparently falls back to an in-memory `ConcurrentMapCacheManager`. The app starts and auth works regardless of whether Redis is running.

## 3. 🟡 MEDIUM — 401 Redirect Loop on Auth Endpoints
**File:** `frontend/src/services/api.js`  
**Problem:** The Axios response interceptor redirected to `/login` on any 401 response. If a user typed a wrong password, the backend returned 401, and the interceptor immediately redirected before the error could be shown — making the error message invisible and causing a redirect loop.  
**Fix:** The 401 redirect is now skipped for `/auth/` endpoints, so login/register errors are displayed correctly.

## 4. 🟡 MEDIUM — Corrupt localStorage Crashes Auth on Reload
**File:** `frontend/src/context/AuthContext.jsx`  
**Problem:** `JSON.parse(localStorage.getItem('user'))` was not wrapped in try/catch. If the stored value was ever corrupted, the app would crash with an uncaught `SyntaxError` on every page load.  
**Fix:** Added try/catch that clears bad storage values and recovers gracefully.

## 5. 🟡 MEDIUM — Unused Import Compile Warning in `RateLimitService`
**File:** `backend/src/main/java/com/newsagg/service/RateLimitService.java`  
**Problem:** `import com.newsagg.config.RateLimitConfig;` was present but `RateLimitConfig` is an empty `@Configuration` class with no beans. The import caused a compile warning and dead code.  
**Fix:** Removed the unused import.

---

## How to Run

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
> Redis is optional — app falls back to in-memory cache automatically.  
> Backend starts on http://localhost:8080

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
> Frontend starts on http://localhost:5173  
> API calls are proxied to the backend via Vite's dev proxy.

### Environment
Copy `.env.example` to `.env` and set your `NEWS_API_KEY` from https://newsapi.org/
