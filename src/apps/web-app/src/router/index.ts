import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { IonTabs } from '@ionic/vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/matches'
  },
  {
    path: '/fav',
    name: 'Избранное',
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
    component: () => import('@web/views/StandingsPage.vue'),
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
        redirect: 'matches',
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
