import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { IonTabs } from '@ionic/vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Главная',
    component: () => import('@web/views/HomePage.vue'),
  },
  {
    path: '/matches',
    name: 'Матчи',
    component: () => import('@web/views/MatchesPage.vue'),
  },
  {
    path: '/standings',
    name: 'Соревнования',
    component: () => import('@web/views/HomePage.vue'),
  },
  {
    path: '/settings',
    name: 'Настройки',
    component: () => import('@web/views/HomePage.vue'),
  },
  {
    path: '/tabs/',
    component: IonTabs,
    children: [
      {
        path: '/',
        redirect: 'home',
      },
    ],
  },
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(),
  routes
})

export default router
