import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Loader } from 'lucide-react'
import { newsService } from '../services/newsService'
import ArticleCard from './ArticleCard'
import styles from './SearchBar.module.css'

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSearch = async (q) => {
    if (!q.trim()) { setResults([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    try {
      const res = await newsService.searchNews(q)
      setResults(res.data.data?.articles || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => handleSearch(val), 500)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.inputWrap}>
          <Search size={18} className={styles.icon} />
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder="Search news, topics, sources..."
            className={styles.input}
          />
          {loading && <Loader size={16} className={styles.spinner} />}
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {searched && (
          <div className={styles.results}>
            {results.length === 0 && !loading ? (
              <div className={styles.empty}>No results found for "{query}"</div>
            ) : (
              <div className={styles.grid}>
                {results.slice(0, 9).map((article, i) => (
                  <ArticleCard key={article.url + i} article={article} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
