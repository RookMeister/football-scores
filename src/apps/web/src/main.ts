import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import App from './App.vue';
// import Home from '@web/pages/index.vue'
import Matches from '@web/matches/views/index.vue'
// import Standings from '@web/pages/standings/index.vue'
// css
// import './assets/css/vendor.css';

// const routesBot = [
//   { path: '/bot/', component: Home },
//   { path: '/bot/matches/', component: Matches  },
//   { path: '/bot/standings/', component: Standings  },
//   { path: '/bot/standings/:id/', component: Standings  }
// ]

const routes: RouteRecordRaw[] = [
  { path: '/', component: Matches  },
  { path: '/matches', component: Matches }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);

app.use(router);
app.mount('#app');
