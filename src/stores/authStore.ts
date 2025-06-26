import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | User,
    token: null as null | string,
  }),
  actions: {
    setSession({ user, token }) {
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.$reset()
      localStorage.removeItem('token')
    },
  },
})
