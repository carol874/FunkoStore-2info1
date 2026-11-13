<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { lerCarrinho, ouvirAlteracoesCarrinho } from '@/services/carrinho';

const itensCarrinho = ref([]);
const quantidadeCarrinho = computed(() =>
  itensCarrinho.value.reduce((total, item) => total + item.quantidade, 0),
);

function atualizarCarrinho() {
  try {
    itensCarrinho.value = lerCarrinho();
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
  <nav
    class="navbar navbar-expand-lg navbar-dark"
    style="background-color: rgb(255, 160, 122)"
  >
    <div class="container-fluid">

      <RouterLink
        class="navbar-brand fw-bold"
        to="/"
      >
         <a>
             <i class="bi bi-bag-heart-fill fs-2 ">
                FunkoStore
             </i>
         </a>
      

      
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#menuPrincipal"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

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

        </div>
      </div>
    </div>
  </nav>
</template>