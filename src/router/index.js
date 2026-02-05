import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/estimator',
      name: 'estimator',
      component: () => import('../views/EstimatorView.vue')
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('../views/JobsView.vue')
    },
    {
      path: '/invoicing',
      name: 'invoicing',
      component: () => import('../views/InvoicingView.vue')
    },
    {
      path: '/administration',
      name: 'administration',
      component: () => import('../views/AdministrationView.vue')
    },
    {
      path: '/support-log',
      name: 'supportLog',
      component: () => import('../views/SupportLogView.vue')
    }
  ]
})

export default router
