<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { supabase } from '../supabase';
import { signOut } from '../../services/authService';

const router = useRouter();
const isAuthenticated = ref(false);
const logoutError = ref('');
let authSubscription;

onMounted(async () => {
  if (!supabase) {
    return;
  }

  const { data } = await supabase.auth.getSession();
  isAuthenticated.value = Boolean(data.session);
  const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
    isAuthenticated.value = Boolean(session);
  });
  authSubscription = subscription;
});

onUnmounted(() => {
  authSubscription?.unsubscribe();
});

async function logout() {
  logoutError.value = '';

  try {
    await signOut();
    await router.push({ name: 'login' });
  } catch (error) {
    logoutError.value = error?.message || 'Não foi possível encerrar a sessão.';
  }
}
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { lerCarrinho, ouvirAlteracoesCarrinho } from '@/services/carrinho';

const itensCarrinho = ref([]);
const quantidadeCarrinho = computed(() =>
  itensCarrinho.value.reduce((total, item) => total + item.quantidade, 0),
);

async function atualizarCarrinho() {
  try {
    itensCarrinho.value = await lerCarrinho();
  } catch (erro) {
    console.error('Erro ao atualizar o indicador do carrinho:', erro);
  }
}
let pararDeOuvir;

onMounted(() => {
  atualizarCarrinho();
  pararDeOuvir = ouvirAlteracoesCarrinho(atualizarCarrinho);
});

onBeforeUnmount(() => {
  pararDeOuvir?.();
});
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: rgb(255, 160, 122)">
    <div class="container-fluid">

      <RouterLink class="navbar-brand fw-bold" to="/">
        <i class="bi bi-bag-heart-fill fs-2"> FunkoStore</i>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#menuPrincipal"
        aria-controls="menuPrincipal"
        aria-expanded="false"
        aria-label="Alternar navegação"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="menuPrincipal" class="collapse navbar-collapse">
        <div class="navbar-nav ms-auto fs-5 align-items-lg-center">
          <RouterLink class="nav-link" to="/">Início</RouterLink>
          <RouterLink class="nav-link" to="/pedidos">Meu carrinho</RouterLink>
          <RouterLink v-if="isAuthenticated" class="nav-link" :to="{ name: 'usuariosList' }">
            Meu perfil
      <div
        class="collapse navbar-collapse"
        id="menuPrincipal"
      >

        <div class="navbar-nav ms-auto fs-5">

          <RouterLink class="nav-link " to="/">
            Início
          </RouterLink>

          <RouterLink class="nav-link" to="/usuario/add">
            Cadastre-se
          </RouterLink>

          <RouterLink class="nav-link" to="/categorias">
            Categorias
          </RouterLink>

          <RouterLink class="nav-link" to="/pedidos">
            Pedidos
          </RouterLink>

          <RouterLink class="nav-link" to="/carrinho">
           Meu carrinho
            <span v-if="quantidadeCarrinho" class="badge rounded-pill bg-light text-dark ms-1">
              {{ quantidadeCarrinho }}
              <span class="visually-hidden">itens no carrinho</span>
            </span>
          </RouterLink>
          <template v-else>
            <RouterLink class="nav-link" :to="{ name: 'login' }">Entrar</RouterLink>
            <RouterLink class="nav-link" :to="{ name: 'addUsuario' }">Criar minha conta</RouterLink>
          </template>
          <button v-if="isAuthenticated" class="btn btn-link nav-link" type="button" @click="logout">
            Sair
          </button>
        </div>
      </div>
    </div>
  </nav>
  <div v-if="logoutError" class="container mt-2">
    <div class="alert alert-danger mb-0" role="alert">{{ logoutError }}</div>
  </div>
</template>
