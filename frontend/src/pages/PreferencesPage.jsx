import React, { useState, useEffect } from 'react'
import { newsService } from '../services/newsService'
import { Check, Save, Globe, Rss, Tag } from 'lucide-react'
import styles from './PreferencesPage.module.css'

const ALL_CATEGORIES = [
  { id: 'general', label: 'General', emoji: '🌐' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'business', label: 'Business', emoji: '📈' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'health', label: 'Health', emoji: '🏥' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
]

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'German' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'nl', label: 'Dutch' },
  { code: 'no', label: 'Norwegian' },
  { code: 'sv', label: 'Swedish' },
]

const COUNTRIES = [
  { code: 'us', label: 'United States' },
  { code: 'gb', label: 'United Kingdom' },
  { code: 'in', label: 'India' },
  { code: 'ca', label: 'Canada' },
  { code: 'au', label: 'Australia' },
  { code: 'de', label: 'Germany' },
  { code: 'fr', label: 'France' },
  { code: 'jp', label: 'Japan' },
  { code: 'cn', label: 'China' },
  { code: 'br', label: 'Brazil' },
]

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState({
    preferredCategories: [],
    preferredSources: [],
    preferredLanguage: 'en',
    preferredCountry: 'us',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchPrefs()
  }, [])

  const fetchPrefs = async () => {
    try {
      const res = await newsService.getPreferences()
      const data = res.data.data
      setPrefs({
        preferredCategories: data.preferredCategories || [],
        preferredSources: data.preferredSources || [],
        preferredLanguage: data.preferredLanguage || 'en',
        preferredCountry: data.preferredCountry || 'us',
      })
    } catch {}
    finally { setLoading(false) }
  }

  const toggleCategory = (cat) => {
    setPrefs(prev => {
      const cats = Array.isArray(prev.preferredCategories) ? [...prev.preferredCategories] : []
      return {
        ...prev,
        preferredCategories: cats.includes(cat)
          ? cats.filter(c => c !== cat)
          : [...cats, cat]
      }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await newsService.updatePreferences(prefs)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ padding: 40, color: 'var(--text-muted)', textAlign: 'center' }}>
      Loading preferences...
    </div>
  )

  const selectedCats = Array.isArray(prefs.preferredCategories) ? prefs.preferredCategories : []

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Preferences</h1>
          <p className={styles.subtitle}>Customize your news feed to match your interests</p>
        </div>
        <button
          className={`${styles.saveBtn} ${saved ? styles.savedBtn : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      <div className={styles.sections}>
        {/* Categories */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Tag size={18} />
            <div>
              <h2 className={styles.sectionTitle}>Topics & Categories</h2>
              <p className={styles.sectionDesc}>Select the topics you want to see in your feed</p>
            </div>
          </div>
          <div className={styles.categoryGrid}>
            {ALL_CATEGORIES.map(cat => {
              const isSelected = selectedCats.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  className={`${styles.categoryCard} ${isSelected ? styles.selected : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <span className={styles.emoji}>{cat.emoji}</span>
                  <span className={styles.catLabel}>{cat.label}</span>
                  {isSelected && <Check size={14} className={styles.checkIcon} />}
                </button>
              )
            })}
          </div>
          {selectedCats.length === 0 && (
            <p className={styles.hint}>Select at least one category to personalize your feed.</p>
          )}
        </section>

        {/* Language & Country */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Globe size={18} />
            <div>
              <h2 className={styles.sectionTitle}>Language & Region</h2>
              <p className={styles.sectionDesc}>Set your preferred language and news region</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Language</label>
              <select
                className={styles.select}
                value={prefs.preferredLanguage}
                onChange={e => setPrefs(p => ({ ...p, preferredLanguage: e.target.value }))}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Country / Region</label>
              <select
                className={styles.select}
                value={prefs.preferredCountry}
                onChange={e => setPrefs(p => ({ ...p, preferredCountry: e.target.value }))}
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
