package com.newsagg.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NewsApiResponse {
    private String status;
    private int totalResults;
    private List<NewsArticle> articles;
}
