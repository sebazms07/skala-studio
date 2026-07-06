import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/proyectos', name: 'projects', component: () => import('../views/ProjectsView.vue') },
  {
    path: '/proyectos/:slug',
    name: 'project-detail',
    component: () => import('../views/ProjectDetailView.vue'),
    props: true,
  },
  { path: '/servicios', name: 'services', component: () => import('../views/ServicesView.vue') },
  {
    path: '/personalizador',
    name: 'configurator',
    component: () => import('../views/KitchenConfiguratorView.vue'),
  },
  { path: '/estudio', name: 'studio', component: () => import('../views/StudioView.vue') },
  { path: '/contacto', name: 'contact', component: () => import('../views/ContactView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, top: 80 }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
