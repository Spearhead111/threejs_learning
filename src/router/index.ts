import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/NewTest',
    name: 'NewTest',
    component: () => import('../views/NewTest.vue'),
  },
  {
    path: '/CombinedType_1',
    name: 'CombinedType_1',
    component: () => import('../views/CombinedType_1.vue'),
  },
  {
    path: '/CombinedType_2',
    name: 'CombinedType_2',
    component: () => import('../views/CombinedType_2.vue'),
  },
  {
    path: '/Test3D',
    name: 'Test3D',
    component: () => import('../views/Test3D.vue'),
    meta: { fullscreen: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
