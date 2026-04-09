export const STORAGE_KEYS = {
  auth: 'chagokchagok-auth-state',
  finance: 'chagokchagok-finance-state',
  theme: 'chagokchagok-theme-state',
}

export function loadJson(key, fallback) {
  const saved = localStorage.getItem(key)
  if (!saved) return fallback

  try {
    return JSON.parse(saved)
  } catch {
    return fallback
  }
}

export function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
