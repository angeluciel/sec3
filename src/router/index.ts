import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../pages/LoginView.vue'
import Dashboard from '@/pages/Dashboard.vue'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/login',
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && auth.token) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
