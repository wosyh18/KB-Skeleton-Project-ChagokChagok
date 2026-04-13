import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getSessionUserId() {
  const value = localStorage.getItem('userId')
  return value ? Number(value) : null
}

export function setSessionUserId(userId) {
  localStorage.setItem('userId', String(userId))
}

export function clearSessionUserId() {
  localStorage.removeItem('userId')
}
