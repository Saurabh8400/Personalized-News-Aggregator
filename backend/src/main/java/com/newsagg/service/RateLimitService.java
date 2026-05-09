package com.newsagg.service;

import io.github.bucket4j.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class RateLimitService {

    @Value("${app.rate-limit.capacity:30}")
    private long capacity;

    @Value("${app.rate-limit.refill-tokens:30}")
    private long refillTokens;

    @Value("${app.rate-limit.refill-duration:60}")
    private long refillDurationSeconds;

    // In-memory fallback if Redis is unavailable
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public boolean tryConsume(String key) {
        Bucket bucket = buckets.computeIfAbsent(key, this::createBucket);
        boolean allowed = bucket.tryConsume(1);
        if (!allowed) {
            log.warn("Rate limit exceeded for key: {}", key);
        }
        return allowed;
    }

    public long getRemainingTokens(String key) {
        Bucket bucket = buckets.get(key);
        return bucket != null ? bucket.getAvailableTokens() : capacity;
    }

    private Bucket createBucket(String key) {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(capacity,
                        Refill.greedy(refillTokens, Duration.ofSeconds(refillDurationSeconds))))
                .build();
    }
}
