import React, { useState } from 'react'
import { Bookmark, BookmarkCheck, ExternalLink, Clock } from 'lucide-react'
import { newsService } from '../services/newsService'
import styles from './ArticleCard.module.css'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const CATEGORY_COLORS = {
  technology: '#60a5fa',
  business: '#4ade80',
  science: '#a78bfa',
  health: '#f472b6',
  sports: '#fb923c',
  entertainment: '#facc15',
  general: '#94a3b8',
}

export default function ArticleCard({ article, onSaveToggle }) {
  const [saved, setSaved] = useState(article.saved || false)
  const [loading, setLoading] = useState(false)
  const [imgError, setImgError] = useState(false)

  const categoryColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general

  const handleSave = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      if (saved) {
        await newsService.unsaveArticle(article.url)
        setSaved(false)
      } else {
        await newsService.saveArticle({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          sourceName: article.source?.name,
          author: article.author,
          category: article.category,
          publishedAt: article.publishedAt,
        })
        setSaved(true)
      }
      onSaveToggle?.()
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className={styles.card}>
      <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        <div className={styles.imageWrapper}>
          {!imgError && article.urlToImage ? (
            <img
              src={article.urlToImage}
              alt={article.title}
              className={styles.image}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className={styles.imageFallback} style={{ '--cat-color': categoryColor }}>
              <span>{article.source?.name?.[0] || 'N'}</span>
            </div>
          )}
          {article.category && (
            <span className={styles.categoryBadge} style={{ '--cat-color': categoryColor }}>
              {article.category}
            </span>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.source}>{article.source?.name || 'Unknown'}</span>
            <span className={styles.dot}>·</span>
            <span className={styles.time}><Clock size={11} />{timeAgo(article.publishedAt)}</span>
          </div>
          <h3 className={styles.title}>{article.title}</h3>
          {article.description && (
            <p className={styles.description}>{article.description}</p>
          )}
        </div>
      </a>

      <div className={styles.footer}>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.readBtn}>
          Read <ExternalLink size={12} />
        </a>
        <button
          className={`${styles.saveBtn} ${saved ? styles.saved : ''}`}
          onClick={handleSave}
          disabled={loading}
          title={saved ? 'Remove from saved' : 'Save article'}
        >
          {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>
    </article>
  )
}
