import api from './api'

export const newsService = {
  getHeadlines: (category = 'general', country = 'us', pageSize = 20) =>
    api.get('/news/headlines', { params: { category, country, pageSize } }),

  getFeed: (pageSize = 30) =>
    api.get('/news/feed', { params: { pageSize } }),

  searchNews: (q, pageSize = 20) =>
    api.get('/news/search', { params: { q, pageSize } }),

  getByCategory: (category, pageSize = 20) =>
    api.get(`/news/category/${category}`, { params: { pageSize } }),

  getPreferences: () =>
    api.get('/user/preferences'),

  updatePreferences: (prefs) =>
    api.put('/user/preferences', prefs),

  saveArticle: (article) =>
    api.post('/user/saved', article),

  unsaveArticle: (url) =>
    api.delete('/user/saved', { params: { url } }),

  getSavedArticles: () =>
    api.get('/user/saved'),
}
