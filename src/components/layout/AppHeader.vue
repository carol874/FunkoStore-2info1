
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { supabase } from '../supabase';
import { signOut } from '../../services/authService';
import { lerCarrinho, ouvirAlteracoesCarrinho } from '@/services/carrinho';

const router = useRouter();

const isAuthenticated = ref(false);
const logoutError = ref('');
const itensCarrinho = ref([]);

let authSubscription;
let pararDeOuvir;

const quantidadeCarrinho = computed(() =>
  itensCarrinho.value.reduce(
    (total, item) => total + item.quantidade,
    0
  )
);

async function atualizarCarrinho() {
  try {
    itensCarrinho.value = await lerCarrinho();
  } catch (erro) {
    console.error('Erro ao atualizar o indicador do carrinho:', erro);
  }
}

onMounted(async () => {
  atualizarCarrinho();
  pararDeOuvir = ouvirAlteracoesCarrinho(atualizarCarrinho);

  if (!supabase) return;

  const { data } = await supabase.auth.getSession();
  isAuthenticated.value = Boolean(data.session);

  const { data: subscription } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      isAuthenticated.value = Boolean(session);
    }
  );

  authSubscription = subscription;
});

onUnmounted(() => {
  authSubscription?.unsubscribe();
  pararDeOuvir?.();
});

async function logout() {
  logoutError.value = '';

  try {
    await signOut();
    await router.push({ name: 'login' });
  } catch (error) {
    logoutError.value =
      error?.message || 'Não foi possível encerrar a sessão.';
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark header-loja">
    <div class="container-fluid px-lg-4">

      <!-- LOGO -->
      <RouterLink class="navbar-brand fw-bold marca-loja" to="/">
        <i class="bi bi-bag-heart-fill"></i>
        FunkoStore
      </RouterLink>

      <!-- MENU MOBILE -->
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

      <!-- NAVEGAÇÃO -->
      <div id="menuPrincipal" class="collapse navbar-collapse">
        <div class="navbar-nav ms-auto fs-5 align-items-lg-center menu-links">

          <RouterLink class="nav-link" to="/">
            <i class="bi bi-house-door"></i>
            Início
          </RouterLink>

          <RouterLink class="nav-link" to="/usuario/add">
            <i class="bi bi-person-plus"></i>
            Cadastre-se
          </RouterLink>

          <RouterLink class="nav-link" to="/categorias">
            <i class="bi bi-grid"></i>
            Categorias
          </RouterLink>

          <RouterLink class="nav-link" to="/pedidos">
            <i class="bi bi-box-seam"></i>
            Pedidos
          </RouterLink>

          <RouterLink class="nav-link" to="/carrinho">
            <i class="bi bi-cart3"></i>
            Meu carrinho

            <span
              v-if="quantidadeCarrinho"
              class="contador-carrinho"
            >
              {{ quantidadeCarrinho }}
            </span>
          </RouterLink>

          <RouterLink
            v-if="isAuthenticated"
            class="nav-link"
            :to="{ name: 'usuariosList' }"
          >
            <i class="bi bi-person-circle"></i>
            Meu perfil
          </RouterLink>

          <template v-if="!isAuthenticated">
            <RouterLink class="nav-link" :to="{ name: 'login' }">
              <i class="bi bi-box-arrow-in-right"></i>
              Entrar
            </RouterLink>

            <RouterLink
              class="botao-cadastro"
              :to="{ name: 'addUsuario' }"
            >
              Criar conta
            </RouterLink>
          </template>

          <button
            v-if="isAuthenticated"
            class="botao-sair"
            type="button"
            @click="logout"
          >
            <i class="bi bi-box-arrow-right"></i>
            Sair
          </button>

        </div>
      </div>
    </div>
  </nav>

  <div v-if="logoutError" class="container mt-2">
    <div class="alert alert-danger mb-0" role="alert">
      {{ logoutError }}
    </div>
  </div>
</template>

<style scoped>
/* CABEÇALHO */
.header-loja {
  background-color: rgb(255, 160, 122);
  padding: 10px 0;
  box-shadow: 0 3px 12px rgba(80, 40, 30, 0.12);
}

/* LOGO */
.marca-loja {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #633a32 !important;
  font-size: 27px;
  letter-spacing: -0.7px;
  transition: 0.25s ease;
}

.marca-loja i {
  font-size: 29px;
}

.marca-loja:hover {
  transform: translateY(-2px);
}

/* LINKS */
.menu-links {
  gap: 5px;
}

.menu-links .nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #633a32;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 9px;
  transition: background 0.25s ease, color 0.25s ease;
}

.menu-links .nav-link i {
  font-size: 17px;
}

.menu-links .nav-link:hover,
.menu-links .nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.28);
  color: #4e2925;
}

/* CONTADOR DO CARRINHO */
.contador-carrinho {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 21px;
  height: 21px;
  padding: 0 6px;
  border-radius: 20px;
  background-color: #713c35;
  color: white;
  font-size: 11px;
  font-weight: 700;
}

/* BOTÃO CADASTRO */
.botao-cadastro {
  padding: 10px 15px;
  margin-left: 5px;
  border-radius: 9px;
  background-color: #713c35;
  color: white;
  font-size: 15px;
  font-weight: 650;
  text-decoration: none;
  transition: 0.25s ease;
}

.botao-cadastro:hover {
  background-color: #542d28;
  color: white;
  transform: translateY(-2px);
}

/* BOTÃO SAIR */
.botao-sair {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  margin-left: 5px;
  border: 1px solid rgba(99, 58, 50, 0.35);
  border-radius: 9px;
  background: transparent;
  color: #633a32;
  font-size: 15px;
  font-weight: 650;
  transition: 0.25s ease;
}

.botao-sair:hover {
  background-color: #713c35;
  color: white;
}

/* MENU RESPONSIVO */
.navbar-toggler {
  border-color: rgba(99, 58, 50, 0.4);
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 3px rgba(99, 58, 50, 0.15);
}

@media (max-width: 991px) {
  .menu-links {
    align-items: stretch !important;
    padding: 12px 0;
  }

  .menu-links .nav-link {
    padding: 11px 12px;
  }

  .botao-cadastro,
  .botao-sair {
    text-align: center;
    justify-content: center;
    margin: 7px 0;
  }
}

@media (max-width: 480px) {
  .marca-loja {
    font-size: 23px;
  }

  .marca-loja i {
    font-size: 25px;
  }
}
</style>
