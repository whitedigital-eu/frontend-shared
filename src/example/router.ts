import { createRouter, createWebHistory } from 'vue-router'
const InputComponentsPage = () => import('./pages/InputComponentsPage.vue')

const routes = [
  {
    path: '/',
    redirect: {
      name: 'input-components',
    },
  },
  {
    name: 'input-components',
    path: '/input-components',
    component: InputComponentsPage,
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'login' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
})

export default router
