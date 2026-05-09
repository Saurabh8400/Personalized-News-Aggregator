package com.newsagg.repository;

import com.newsagg.entity.SavedArticle;
import com.newsagg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavedArticleRepository extends JpaRepository<SavedArticle, Long> {
    List<SavedArticle> findByUserOrderBySavedAtDesc(User user);
    Optional<SavedArticle> findByUserAndUrl(User user, String url);
    boolean existsByUserAndUrl(User user, String url);
    void deleteByUserAndUrl(User user, String url);
    long countByUser(User user);
}
