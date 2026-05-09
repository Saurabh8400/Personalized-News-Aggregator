package com.newsagg.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${app.cache.news-ttl:300}")
    private long newsTtl;

    @Value("${app.cache.headlines-ttl:120}")
    private long headlinesTtl;

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(redisHost, redisPort);
        // Use short connection timeout so app doesn't hang on startup if Redis is absent
        LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
                .commandTimeout(Duration.ofMillis(500))
                .build();
        return new LettuceConnectionFactory(config, clientConfig);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        try {
            // Test connection — if Redis is not available fall back to in-memory cache
            factory.getConnection().ping();

            RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofSeconds(newsTtl))
                    .serializeKeysWith(RedisSerializationContext.SerializationPair
                            .fromSerializer(new StringRedisSerializer()))
                    .serializeValuesWith(RedisSerializationContext.SerializationPair
                            .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                    .disableCachingNullValues();

            Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
            cacheConfigs.put("news", defaultConfig.entryTtl(Duration.ofSeconds(newsTtl)));
            cacheConfigs.put("headlines", defaultConfig.entryTtl(Duration.ofSeconds(headlinesTtl)));
            cacheConfigs.put("search", defaultConfig.entryTtl(Duration.ofSeconds(newsTtl)));

            return RedisCacheManager.builder(factory)
                    .cacheDefaults(defaultConfig)
                    .withInitialCacheConfigurations(cacheConfigs)
                    .build();
        } catch (Exception e) {
            // Redis is not available — fall back to simple in-memory cache so the app still starts
            return new ConcurrentMapCacheManager("news", "headlines", "search");
        }
    }
}
