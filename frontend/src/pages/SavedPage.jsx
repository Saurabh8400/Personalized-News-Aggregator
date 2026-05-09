import React, { useState, useEffect } from 'react'
import { newsService } from '../services/newsService'
import { Bookmark, Trash2, ExternalLink, Clock } from 'lucide-react'
import styles from './SavedPage.module.css'

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
  technology: '#60a5fa', business: '#4ade80', science: '#a78bfa',
  health: '#f472b6', sports: '#fb923c', entertainment: '#facc15', general: '#94a3b8',
}

export default function SavedPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSaved() }, [])

  const fetchSaved = async () => {
    setLoading(true)
    try {
      const res = await newsService.getSavedArticles()
      setArticles(res.data.data || [])
    } catch {
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (url) => {
    try {
      await newsService.unsaveArticle(url)
      setArticles(prev => prev.filter(a => a.url !== url))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Saved Articles</h1>
          <p className={styles.subtitle}>{articles.length} article{articles.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {loading ? (
        <div className={styles.list}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeletonItem}>
              <div className="skeleton" style={{ width: 80, height: 80, borderRadius: 8, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 18, width: '90%', borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className={styles.empty}>
          <Bookmark size={48} className={styles.emptyIcon} />
          <h3>No saved articles yet</h3>
          <p>Articles you save will appear here for easy access.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {articles.map((article, i) => {
            const catColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general
            return (
              <div key={article.id || i} className={styles.item}>
                <div className={styles.itemImage}>
                  {article.urlToImage ? (
                    <img src={article.urlToImage} alt={article.title}
                      onError={e => { e.target.style.display = 'none' }} />
                  ) : (
                    <div className={styles.imagePlaceholder} style={{ '--cat-color': catColor }}>
                      {article.sourceName?.[0] || 'N'}
                    </div>
                  )}
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.itemMeta}>
                    {article.category && (
                      <span className={styles.cat} style={{ color: catColor }}>
                        {article.category}
                      </span>
                    )}
                    <span className={styles.source}>{article.sourceName}</span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.time}>
                      <Clock size={11} />
                      {timeAgo(article.savedAt)}
                    </span>
                  </div>
                  <h3 className={styles.itemTitle}>{article.title}</h3>
                  {article.description && (
                    <p className={styles.itemDesc}>{article.description}</p>
                  )}
                </div>
                <div className={styles.itemActions}>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.actionBtn}>
                    <ExternalLink size={15} />
                  </a>
                  <button className={`${styles.actionBtn} ${styles.removeBtn}`} onClick={() => handleRemove(article.url)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
