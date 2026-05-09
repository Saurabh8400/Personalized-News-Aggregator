package com.newsagg.service;

import com.newsagg.dto.*;
import com.newsagg.entity.SavedArticle;
import com.newsagg.entity.User;
import com.newsagg.repository.SavedArticleRepository;
import com.newsagg.repository.UserRepository;
import com.newsagg.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final SavedArticleRepository savedArticleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(new HashSet<>(Set.of("USER")))
                .preferredCategories(new HashSet<>(Set.of("technology", "general")))
                .preferredSources(new HashSet<>())
                .preferredLanguage("en")
                .preferredCountry("us")
                .enabled(true)
                .build();

        userRepository.save(user);

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(auth);
        String token = jwtUtils.generateJwtToken(auth);

        return AuthResponse.builder()
                .token(token).type("Bearer")
                .id(user.getId()).username(user.getUsername())
                .email(user.getEmail()).roles(user.getRoles())
                .preferredCategories(user.getPreferredCategories())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(auth);
        String token = jwtUtils.generateJwtToken(auth);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .token(token).type("Bearer")
                .id(user.getId()).username(user.getUsername())
                .email(user.getEmail()).roles(user.getRoles())
                .preferredCategories(user.getPreferredCategories())
                .build();
    }

    @Transactional
    public UserPreferencesDto updatePreferences(String username, UserPreferencesDto preferences) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (preferences.getPreferredCategories() != null)
            user.setPreferredCategories(preferences.getPreferredCategories());
        if (preferences.getPreferredSources() != null)
            user.setPreferredSources(preferences.getPreferredSources());
        if (preferences.getPreferredLanguage() != null)
            user.setPreferredLanguage(preferences.getPreferredLanguage());
        if (preferences.getPreferredCountry() != null)
            user.setPreferredCountry(preferences.getPreferredCountry());
        userRepository.save(user);
        return preferences;
    }

    public UserPreferencesDto getPreferences(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserPreferencesDto.builder()
                .preferredCategories(user.getPreferredCategories())
                .preferredSources(user.getPreferredSources())
                .preferredLanguage(user.getPreferredLanguage())
                .preferredCountry(user.getPreferredCountry())
                .build();
    }

    @Transactional
    public void saveArticle(String username, SaveArticleRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (savedArticleRepository.existsByUserAndUrl(user, request.getUrl())) {
            throw new RuntimeException("Article already saved");
        }
        SavedArticle article = SavedArticle.builder()
                .user(user).title(request.getTitle())
                .description(request.getDescription()).url(request.getUrl())
                .urlToImage(request.getUrlToImage()).sourceName(request.getSourceName())
                .author(request.getAuthor()).category(request.getCategory())
                .build();
        if (request.getPublishedAt() != null && !request.getPublishedAt().isEmpty()) {
            try {
                article.setPublishedAt(LocalDateTime.parse(request.getPublishedAt().replace("Z", "")));
            } catch (Exception ignored) {}
        }
        savedArticleRepository.save(article);
    }

    @Transactional
    public void unsaveArticle(String username, String url) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        savedArticleRepository.deleteByUserAndUrl(user, url);
    }

    public List<SavedArticle> getSavedArticles(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return savedArticleRepository.findByUserOrderBySavedAtDesc(user);
    }
}
