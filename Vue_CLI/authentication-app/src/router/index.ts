import { createRouter, createWebHistory, type RouteRecord, type RouteRecordRaw } from 'vue-router'
import NotFoundView from '@/views/NotFound.vue'

const authLayout = () => import('@/views/Auth.vue')
const AdminLayout = () => import('@/layouts/Admin.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'admin',
      redirect: '/auth',
      component: AdminLayout
    },
    {
      path: '/auth',
      name: 'auth',
      component: authLayout
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ] as RouteRecordRaw[],
})

export default router
