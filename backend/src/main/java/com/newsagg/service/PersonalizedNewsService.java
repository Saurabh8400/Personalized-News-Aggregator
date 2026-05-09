package com.newsagg.service;

import com.newsagg.dto.NewsApiResponse;
import com.newsagg.dto.NewsArticle;
import com.newsagg.entity.User;
import com.newsagg.repository.SavedArticleRepository;
import com.newsagg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PersonalizedNewsService {

    private final NewsApiService newsApiService;
    private final UserRepository userRepository;
    private final SavedArticleRepository savedArticleRepository;

    public NewsApiResponse getPersonalizedFeed(String username, int pageSize) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<String> categories = user.getPreferredCategories();
        String country = user.getPreferredCountry();
        String language = user.getPreferredLanguage();

        List<NewsArticle> allArticles = new ArrayList<>();

        if (categories.isEmpty()) {
            NewsApiResponse response = newsApiService.getTopHeadlines("general", country, pageSize);
            if (response != null && response.getArticles() != null) {
                allArticles.addAll(response.getArticles());
            }
        } else {
            int perCategory = Math.max(5, pageSize / categories.size());
            for (String category : categories) {
                NewsApiResponse response = newsApiService.getTopHeadlines(category, country, perCategory);
                if (response != null && response.getArticles() != null) {
                    response.getArticles().forEach(a -> a.setCategory(category));
                    allArticles.addAll(response.getArticles());
                }
            }
        }

        // Mark saved articles
        Set<String> savedUrls = savedArticleRepository.findByUserOrderBySavedAtDesc(user)
                .stream().map(a -> a.getUrl()).collect(Collectors.toSet());
        allArticles.forEach(a -> a.setSaved(savedUrls.contains(a.getUrl())));

        // Shuffle for variety
        Collections.shuffle(allArticles);

        return new NewsApiResponse("ok", allArticles.size(),
                allArticles.stream().limit(pageSize).collect(Collectors.toList()));
    }

    public NewsApiResponse searchNews(String username, String query, int pageSize) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        NewsApiResponse response = newsApiService.searchNews(query, user.getPreferredLanguage(), pageSize);
        if (response != null && response.getArticles() != null) {
            Set<String> savedUrls = savedArticleRepository.findByUserOrderBySavedAtDesc(user)
                    .stream().map(a -> a.getUrl()).collect(Collectors.toSet());
            response.getArticles().forEach(a -> a.setSaved(savedUrls.contains(a.getUrl())));
        }
        return response;
    }
}
