import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { newsService } from '../services/newsService'
import ArticleCard from '../components/ArticleCard'
import { RefreshCw, Zap, TrendingUp } from 'lucide-react'
import styles from './DashboardPage.module.css'

const CATEGORIES = ['general','technology','business','science','health','sports','entertainment']

export default function DashboardPage() {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('feed')
  const [activeCategory, setActiveCategory] = useState('general')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchNews()
  }, [activeTab, activeCategory, refreshKey])

  const fetchNews = async () => {
    setLoading(true)
    try {
      let res
      if (activeTab === 'feed') {
        res = await newsService.getFeed(30)
      } else {
        res = await newsService.getByCategory(activeCategory)
      }
      setArticles(res.data.data?.articles || [])
    } catch (err) {
      console.error(err)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const featuredArticle = articles[0]
  const gridArticles = articles.slice(1)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.greeting}>
            Good {getTimeOfDay()}, <em>{user?.username}</em>
          </h1>
          <p className={styles.subtitle}>Here's what's happening in the world</p>
        </div>
        <button className={styles.refreshBtn} onClick={() => setRefreshKey(k => k + 1)} disabled={loading}>
          <RefreshCw size={16} className={loading ? styles.spinning : ''} />
          Refresh
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'feed' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <Zap size={14} />
          My Feed
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'explore' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          <TrendingUp size={14} />
          Explore
        </button>
      </div>

      {activeTab === 'explore' && (
        <div className={styles.categories}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.catBtn} ${activeCategory === cat ? styles.activeCat : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={`${styles.skeletonImg} skeleton`} />
              <div className={styles.skeletonBody}>
                <div className={`skeleton`} style={{ height: 12, width: '60%', borderRadius: 4 }} />
                <div className={`skeleton`} style={{ height: 18, width: '95%', marginTop: 8, borderRadius: 4 }} />
                <div className={`skeleton`} style={{ height: 18, width: '80%', marginTop: 6, borderRadius: 4 }} />
                <div className={`skeleton`} style={{ height: 13, width: '90%', marginTop: 10, borderRadius: 4 }} />
                <div className={`skeleton`} style={{ height: 13, width: '70%', marginTop: 4, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className={styles.empty}>
          <p>No articles found. Try updating your preferences or checking back later.</p>
        </div>
      ) : (
        <>
          {featuredArticle && (
            <div className={styles.featuredWrapper}>
              <FeaturedArticle article={featuredArticle} onSaveToggle={fetchNews} />
            </div>
          )}
          <div className={styles.grid}>
            {gridArticles.map((article, i) => (
              <ArticleCard key={article.url + i} article={article} onSaveToggle={fetchNews} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function FeaturedArticle({ article, onSaveToggle }) {
  const [saved, setSaved] = useState(article.saved || false)

  const handleSave = async (e) => {
    e.preventDefault()
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
    } catch {}
  }

  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.featured}>
      <div className={styles.featuredImage}>
        {article.urlToImage ? (
          <img src={article.urlToImage} alt={article.title} />
        ) : (
          <div className={styles.featuredFallback} />
        )}
        <div className={styles.featuredOverlay} />
      </div>
      <div className={styles.featuredContent}>
        {article.category && (
          <span className={styles.featuredCat}>{article.category}</span>
        )}
        <h2 className={styles.featuredTitle}>{article.title}</h2>
        {article.description && (
          <p className={styles.featuredDesc}>{article.description}</p>
        )}
        <div className={styles.featuredMeta}>
          <span>{article.source?.name}</span>
          <button onClick={handleSave} className={`${styles.featuredSave} ${saved ? styles.saved : ''}`}>
            {saved ? '✓ Saved' : '+ Save'}
          </button>
        </div>
      </div>
    </a>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}
