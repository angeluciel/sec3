import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../pages/LoginView.vue'
import Dashboard from '@/pages/Dashboard.vue'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  },
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
      path: '/Manage',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/Manage/Dashboard',
        },
        {
          path: 'Dashboard',
          name: 'DashboardChild',
          component: () => import('@/pages/files/dashboardView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'importFiles',
          name: 'ImportFiles',
          component: () => import('@/pages/files/uploadReport.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'expenses',
          name: 'Expenses',
          component: () => import('@/pages/files/expensesView.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/funcionarios',
      name: 'Funcionarios',
      component: () => import('@/pages/files/funcionarios.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()

  if (!auth.token) {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      await auth.restoreSession(storedToken)
    }
  }
  if (to.meta.requiresAuth && !auth.token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && auth.token) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
