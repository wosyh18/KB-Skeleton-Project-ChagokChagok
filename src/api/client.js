import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000',
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
