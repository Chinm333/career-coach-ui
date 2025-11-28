export const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  get(key, defaultValue = null) {
    const raw = localStorage.getItem(key)
    if (!raw) return defaultValue
    try {
      return JSON.parse(raw)
    } catch {
      return defaultValue
    }
  },

  remove(key) {
    localStorage.removeItem(key)
  }
}
