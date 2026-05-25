import AddApplicaiton from '@/views/AddApplication.vue'
import Applications from '@/views/Applications.vue'
import Details from '@/views/Details.vue'
import EditApplication from '@/views/EditApplication.vue'
import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/applications',
      name: 'Applications',
      component: Applications
    },
    {
      path: '/applications/add',
      name: 'AddAplication',
      component: AddApplicaiton
    },
    {
      path: '/applications/:id',
      name: 'Details',
      component: Details,
    },
    {
      path: '/applications/:id/edit',
      name: 'EditApplication',
      component: EditApplication
    }
  ],
})

export default router
