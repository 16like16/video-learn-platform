import { createRouter, createWebHistory } from 'vue-router';
import { session } from '../utils/auth';

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
  { path: '/course/:id', name: 'course-detail', component: () => import('../views/CourseDetailView.vue') },
  { path: '/favorites', name: 'favorites', component: () => import('../views/FavoritesView.vue'), meta: { auth: true } },
  { path: '/learning', name: 'learning', component: () => import('../views/LearningView.vue'), meta: { auth: true } },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { auth: true } },
  { path: '/creator', name: 'creator', component: () => import('../views/CreatorCenterView.vue'), meta: { auth: true } },
  { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue'), meta: { auth: true, admin: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.auth && !session.token) {
    return '/login';
  }
  if (to.meta.admin && session.user?.role !== 'admin') {
    return '/';
  }
  return true;
});

export default router;
