import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/composition',
      name: 'composition',
      // 교재 145p Hands on - Weather Composition
      component: () => import('../views/CompositionView.vue'),
    },
    {
      path: '/component',
      name: 'component',
      // 교재 178p Hands on - Weather Component
      component: () => import('../views/ComponentView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
