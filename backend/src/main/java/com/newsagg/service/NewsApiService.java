package com.newsagg.service;

import com.newsagg.dto.NewsApiResponse;
import com.newsagg.dto.NewsArticle;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsApiService {

    private final RestTemplate restTemplate;

    @Value("${app.newsapi.key}")
    private String apiKey;

    @Value("${app.newsapi.base-url}")
    private String baseUrl;

    @Cacheable(value = "headlines", key = "#category + ':' + #country + ':' + #pageSize")
    public NewsApiResponse getTopHeadlines(String category, String country, int pageSize) {
        if ("demo_key_replace_with_real".equals(apiKey)) {
            return getMockHeadlines(category);
        }
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl + "/top-headlines")
                    .queryParam("apiKey", apiKey)
                    .queryParam("pageSize", Math.min(pageSize, 100))
                    .queryParam("country", country != null ? country : "us");
            if (category != null && !category.equalsIgnoreCase("general")) {
                builder.queryParam("category", category);
            }
            String url = builder.toUriString();
            log.debug("Fetching headlines from: {}", url.replace(apiKey, "***"));
            return restTemplate.getForObject(url, NewsApiResponse.class);
        } catch (Exception e) {
            log.error("Error fetching headlines: {}", e.getMessage());
            return getMockHeadlines(category);
        }
    }

    @Cacheable(value = "search", key = "#query + ':' + #language + ':' + #pageSize")
    public NewsApiResponse searchNews(String query, String language, int pageSize) {
        if ("demo_key_replace_with_real".equals(apiKey)) {
            return getMockSearch(query);
        }
        try {
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/everything")
                    .queryParam("apiKey", apiKey)
                    .queryParam("q", query)
                    .queryParam("language", language != null ? language : "en")
                    .queryParam("pageSize", Math.min(pageSize, 100))
                    .queryParam("sortBy", "publishedAt")
                    .toUriString();
            log.debug("Searching news for query: {}", query);
            return restTemplate.getForObject(url, NewsApiResponse.class);
        } catch (Exception e) {
            log.error("Error searching news: {}", e.getMessage());
            return getMockSearch(query);
        }
    }

    @Cacheable(value = "news", key = "#sources + ':' + #pageSize")
    public NewsApiResponse getNewsBySources(String sources, int pageSize) {
        if ("demo_key_replace_with_real".equals(apiKey)) {
            return getMockHeadlines("technology");
        }
        try {
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/everything")
                    .queryParam("apiKey", apiKey)
                    .queryParam("sources", sources)
                    .queryParam("pageSize", Math.min(pageSize, 100))
                    .queryParam("sortBy", "publishedAt")
                    .toUriString();
            return restTemplate.getForObject(url, NewsApiResponse.class);
        } catch (Exception e) {
            log.error("Error fetching news by sources: {}", e.getMessage());
            return new NewsApiResponse("ok", 0, new ArrayList<>());
        }
    }

    // =================== Mock Data for Demo ===================

    private NewsApiResponse getMockHeadlines(String category) {
        List<NewsArticle> articles = new ArrayList<>();
        String[] categories = {"technology", "business", "science", "health", "sports", "entertainment", "general"};
        String[] mockTitles = {
            "Breakthrough in Quantum Computing Sets New Record",
            "Global Markets Rally on Strong Economic Data",
            "Scientists Discover New Species in Deep Ocean",
            "New AI Model Achieves Human-Level Performance",
            "Climate Summit Reaches Historic Agreement",
            "Space Mission Successfully Returns Samples",
            "Electric Vehicle Sales Surge Globally",
            "Researchers Develop Promising Cancer Treatment",
            "Tech Giants Face New Regulatory Scrutiny",
            "Renewable Energy Hits Record Production Levels",
            "Startup Raises $500M for Fusion Energy Project",
            "World Leaders Gather for Economic Forum",
            "Scientists Map Complete Human Protein Structure",
            "New Study Links Diet to Mental Health Improvements",
            "Autonomous Vehicles Begin City-Wide Deployment"
        };
        String[] mockDescriptions = {
            "Researchers have achieved a significant milestone that could revolutionize computing as we know it.",
            "Financial markets showed strong gains following better-than-expected economic indicators.",
            "Marine biologists announce the discovery of a previously unknown species in the Pacific Ocean.",
            "A new artificial intelligence system has demonstrated remarkable capabilities matching human experts.",
            "World leaders have signed a landmark agreement aimed at reducing carbon emissions by 50% by 2030.",
            "The international space mission has safely returned to Earth with valuable celestial samples.",
            "The transition to electric vehicles is accelerating faster than industry experts predicted.",
            "A team of oncologists has developed a treatment showing remarkable results in clinical trials.",
            "Regulators around the world are scrutinizing major technology companies over data practices.",
            "Solar and wind energy production has reached an all-time high in multiple countries simultaneously."
        };
        String[] sources = {"BBC News", "Reuters", "The Guardian", "CNN", "TechCrunch", "Bloomberg", "AP News"};
        String[] images = {
            "https://picsum.photos/seed/tech1/800/450",
            "https://picsum.photos/seed/biz2/800/450",
            "https://picsum.photos/seed/sci3/800/450",
            "https://picsum.photos/seed/ai4/800/450",
            "https://picsum.photos/seed/env5/800/450",
            "https://picsum.photos/seed/space6/800/450",
            "https://picsum.photos/seed/ev7/800/450",
            "https://picsum.photos/seed/health8/800/450",
            "https://picsum.photos/seed/tech9/800/450",
            "https://picsum.photos/seed/energy10/800/450",
            "https://picsum.photos/seed/fusion11/800/450",
            "https://picsum.photos/seed/world12/800/450",
            "https://picsum.photos/seed/dna13/800/450",
            "https://picsum.photos/seed/food14/800/450",
            "https://picsum.photos/seed/car15/800/450"
        };

        Random rand = new Random();
        for (int i = 0; i < Math.min(mockTitles.length, 15); i++) {
            NewsArticle article = new NewsArticle();
            NewsArticle.NewsSource source = new NewsArticle.NewsSource();
            source.setId(sources[i % sources.length].toLowerCase().replace(" ", "-"));
            source.setName(sources[i % sources.length]);
            article.setSource(source);
            article.setTitle(mockTitles[i]);
            article.setDescription(mockDescriptions[i % mockDescriptions.length]);
            article.setUrl("https://example.com/article/" + (i + 1));
            article.setUrlToImage(images[i]);
            article.setPublishedAt(java.time.Instant.now().minusSeconds(rand.nextInt(86400)).toString());
            article.setCategory(category != null ? category : categories[i % categories.length]);
            articles.add(article);
        }
        return new NewsApiResponse("ok", articles.size(), articles);
    }

    private NewsApiResponse getMockSearch(String query) {
        NewsApiResponse response = getMockHeadlines("general");
        response.getArticles().forEach(a ->
            a.setTitle(a.getTitle() + " — Related to: " + query));
        return response;
    }
}
