package com.newsagg.controller;

import com.newsagg.dto.*;
import com.newsagg.entity.SavedArticle;
import com.newsagg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;

    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<UserPreferencesDto>> getPreferences(Authentication auth) {
        UserPreferencesDto prefs = userService.getPreferences(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(prefs, "Preferences fetched"));
    }

    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<UserPreferencesDto>> updatePreferences(
            Authentication auth,
            @RequestBody UserPreferencesDto preferences) {
        UserPreferencesDto updated = userService.updatePreferences(auth.getName(), preferences);
        return ResponseEntity.ok(ApiResponse.success(updated, "Preferences updated"));
    }

    @PostMapping("/saved")
    public ResponseEntity<ApiResponse<String>> saveArticle(
            Authentication auth,
            @Valid @RequestBody SaveArticleRequest request) {
        userService.saveArticle(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("saved", "Article saved successfully"));
    }

    @DeleteMapping("/saved")
    public ResponseEntity<ApiResponse<String>> unsaveArticle(
            Authentication auth,
            @RequestParam String url) {
        userService.unsaveArticle(auth.getName(), url);
        return ResponseEntity.ok(ApiResponse.success("removed", "Article removed from saved"));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<SavedArticle>>> getSavedArticles(Authentication auth) {
        List<SavedArticle> articles = userService.getSavedArticles(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(articles, "Saved articles fetched"));
    }
}
