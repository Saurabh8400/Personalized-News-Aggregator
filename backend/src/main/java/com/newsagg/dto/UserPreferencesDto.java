package com.newsagg.dto;

import lombok.*;
import java.util.Set;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserPreferencesDto {
    private Set<String> preferredCategories;
    private Set<String> preferredSources;
    private String preferredLanguage;
    private String preferredCountry;
}
