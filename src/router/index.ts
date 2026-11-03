import { createRouter, createWebHistory } from 'vue-router'

import { ppidRoutes } from './main/ppid'

const routes = [...ppidRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
