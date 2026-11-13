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
      path: '/funkos/add',
      name: 'addFunkos',
      component: () => import('../views/AddFunko.vue'),
    },
    {
      path: '/funkos/:id',
      name: 'detalhesFunkos',
      component: () => import('../views/FunkoDetails.vue'),
    },
     {
      path: '/usuario/:id',
      name: 'detalhesUsuario',
      component: () => import('../views/UsuarioDetails.vue'),
    },
    {
      path: '/usuario/add',
      name: 'addUsuario',
      component: () => import('../views/AddUsuario.vue'),
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriasView.vue'),
    },
     {
      path: '/carrinho',
      name: 'carrinho',
      component: () => import('../views/carrinho/Carrinhoview.vue'),
    },
     
  ],
});

export default router;
