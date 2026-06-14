import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/posts/:slug',
    name: 'article',
    component: () => import('../views/Article.vue'),
  },
  {
    path: '/p/:slug',
    name: 'note-p',
    component: () => import('../views/Note.vue'),
  },
  {
    path: '/k/:slug',
    name: 'note-k',
    component: () => import('../views/Note.vue'),
  },
  {
    path: '/c/:slug',
    name: 'note-c',
    component: () => import('../views/Note.vue'),
  },
  {
    path: '/notes/:slug',
    name: 'note',
    component: () => import('../views/Note.vue'),
  },
  {
    path: '/type/:name',
    name: 'type',
    component: () => import('../views/Type.vue'),
  },
  {
    path: '/friends',
    name: 'friends',
    component: () => import('../views/Friends.vue'),
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('../views/Posts.vue'),
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('../views/Categories.vue'),
  },
  {
    path: '/tags',
    name: 'tags',
    component: () => import('../views/Tags.vue'),
  },
  {
    path: '/tag/:name',
    name: 'tag-articles',
    component: () => import('../views/TagArticles.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
