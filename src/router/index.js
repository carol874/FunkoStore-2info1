import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/usuarios',
      name: 'usuariosList',
      component: () => import('../views/UsuariosList.vue'),
    },
    {
      path: '/usuario/add',
      name: 'addUsuario',
      component: () => import('../views/AddUsuario.vue'),
    },
    {
      path: '/usuario/:id',
      name: 'detalhesUsuario',
      component: () => import('../views/UsuarioDetails.vue'),
    },
    {
      path: '/usuario/:id/editar',
      name: 'editarUsuario',
      component: () => import('../views/EditUsuario.vue'),
    },
    {
      path: '/funkos/add',
      name: 'addFunkos',
      component: () => import('../views/AddFunko.vue'),
    },
    {
      path: '/funkos/:id',
      name: 'detalhesFunkos',
      component: () => import('../views/FunkoDetails.vue'),
    },
  ],
});

export default router;
