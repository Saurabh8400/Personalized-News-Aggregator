package com.newsagg.controller;

import com.newsagg.dto.*;
import com.newsagg.service.NewsApiService;
import com.newsagg.service.PersonalizedNewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class NewsController {

    private final NewsApiService newsApiService;
    private final PersonalizedNewsService personalizedNewsService;

    @GetMapping("/headlines")
    public ResponseEntity<ApiResponse<NewsApiResponse>> getHeadlines(
            @RequestParam(defaultValue = "general") String category,
            @RequestParam(defaultValue = "us") String country,
            @RequestParam(defaultValue = "20") int pageSize) {
        NewsApiResponse response = newsApiService.getTopHeadlines(category, country, pageSize);
        return ResponseEntity.ok(ApiResponse.success(response, "Headlines fetched"));
    }

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<NewsApiResponse>> getPersonalizedFeed(
            Authentication auth,
            @RequestParam(defaultValue = "30") int pageSize) {
        NewsApiResponse response = personalizedNewsService.getPersonalizedFeed(auth.getName(), pageSize);
        return ResponseEntity.ok(ApiResponse.success(response, "Personalized feed fetched"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<NewsApiResponse>> searchNews(
            Authentication auth,
            @RequestParam String q,
            @RequestParam(defaultValue = "20") int pageSize) {
        NewsApiResponse response = personalizedNewsService.searchNews(auth.getName(), q, pageSize);
        return ResponseEntity.ok(ApiResponse.success(response, "Search results fetched"));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<NewsApiResponse>> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "us") String country,
            @RequestParam(defaultValue = "20") int pageSize) {
        NewsApiResponse response = newsApiService.getTopHeadlines(category, country, pageSize);
        if (response != null && response.getArticles() != null) {
            response.getArticles().forEach(a -> a.setCategory(category));
        }
        return ResponseEntity.ok(ApiResponse.success(response, "Category news fetched"));
    }
}
