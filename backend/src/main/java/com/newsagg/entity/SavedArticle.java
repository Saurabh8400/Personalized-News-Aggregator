package com.newsagg.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_articles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SavedArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, length = 1000)
    private String url;

    @Column(length = 500)
    private String urlToImage;

    private String sourceName;
    private String author;
    private String category;
    private LocalDateTime publishedAt;
    private LocalDateTime savedAt;

    @PrePersist
    protected void onCreate() {
        savedAt = LocalDateTime.now();
    }
}
