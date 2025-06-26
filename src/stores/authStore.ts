import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '../types/User'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isInitialized = ref(false)

  function setSession(session: { user: User; token: string }) {
    user.value = session.user
    token.value = session.token
    localStorage.setItem('token', session.token)
    localStorage.setItem('user', JSON.stringify(session.user))
  }

  async function restoreSession(storedToken: string) {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
        return true
      }
    } catch (error) {
      logout()
      console.error('Failed to restore session:', error)
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    return Promise.resolve()
  }

  function initializeStore() {
    if (!isInitialized.value) {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        restoreSession(storedToken)
      }
      isInitialized.value = true
    }
  }

  return { user, token, isInitialized, setSession, restoreSession, logout, initializeStore }
})
