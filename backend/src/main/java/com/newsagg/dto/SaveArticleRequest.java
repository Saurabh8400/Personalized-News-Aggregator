package com.newsagg.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class SaveArticleRequest {
    @NotBlank(message = "") private String title;
    private String description;
    @NotBlank(message = "") private String url;
    private String urlToImage;
    private String sourceName;
    private String author;
    private String category;
    private String publishedAt;
}
