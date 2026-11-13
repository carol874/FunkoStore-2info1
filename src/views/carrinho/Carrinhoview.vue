<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
  atualizarQuantidade,
  esvaziarCarrinho,
  lerCarrinho,
  ouvirAlteracoesCarrinho,
  removerDoCarrinho,
} from '@/services/carrinho';

defineOptions({ name: 'CarrinhoView' });

const itens = ref([]);
const carregando = ref(true);
const mensagemErro = ref('');
const pedidoFinalizado = ref(false);

const quantidadeItens = computed(() =>
  itens.value.reduce((total, item) => total + item.quantidade, 0),
);
const valorTotal = computed(() =>
  itens.value.reduce(
    (total, item) => total + Number(item.preco) * item.quantidade,
    0,
  ),
);

function carregarCarrinho() {
  mensagemErro.value = '';

  try {
    itens.value = lerCarrinho();
  } catch (erro) {
    console.error('Erro ao carregar o carrinho:', erro);
    mensagemErro.value = erro.message || 'Não foi possível carregar o carrinho.';
  } finally {
    carregando.value = false;
  }
}

function formatarPreco(preco) {
  return Number(preco || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function alterarQuantidade(item, quantidade) {
  mensagemErro.value = '';

  try {
    itens.value = atualizarQuantidade(item.id, quantidade);
    pedidoFinalizado.value = false;
  } catch (erro) {
    console.error('Erro ao atualizar quantidade do carrinho:', erro);
    mensagemErro.value = erro.message || 'Não foi possível atualizar a quantidade.';
  }
}

function removerItem(item) {
  mensagemErro.value = '';

  try {
    itens.value = removerDoCarrinho(item.id);
    pedidoFinalizado.value = false;
  } catch (erro) {
    console.error('Erro ao remover Funko do carrinho:', erro);
    mensagemErro.value = erro.message || 'Não foi possível remover este Funko.';
  }
}

function apagarPedido() {
  if (!window.confirm('Deseja apagar todos os Funkos deste pedido?')) return;

  mensagemErro.value = '';

  try {
    itens.value = esvaziarCarrinho();
    pedidoFinalizado.value = false;
  } catch (erro) {
    console.error('Erro ao apagar o pedido:', erro);
    mensagemErro.value = erro.message || 'Não foi possível apagar o pedido.';
  }
}

function finalizarPedido() {
  if (itens.value.length === 0) return;

  mensagemErro.value = '';

  try {
    esvaziarCarrinho();
    itens.value = [];
    pedidoFinalizado.value = true;
  } catch (erro) {
    console.error('Erro ao finalizar o pedido:', erro);
    mensagemErro.value = erro.message || 'Não foi possível finalizar o pedido.';
  }
}

let pararDeOuvir;

onMounted(() => {
  carregarCarrinho();
  pararDeOuvir = ouvirAlteracoesCarrinho(carregarCarrinho);
});

onBeforeUnmount(() => {
  pararDeOuvir?.();
});
</script>

<template>
  <section class="container py-5">
    <header class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <h1 class="h2 fw-bold mb-1">Meu carrinho</h1>
        <p class="text-body-secondary mb-0">
          {{ quantidadeItens }} {{ quantidadeItens === 1 ? 'Funko' : 'Funkos' }} no pedido
        </p>
      </div>
      <RouterLink class="btn btn-outline-secondary" to="/">
        <i class="bi bi-arrow-left me-1" aria-hidden="true"></i>
        Continuar comprando
      </RouterLink>
    </header>

    <div v-if="mensagemErro" class="alert alert-danger" role="alert">
      {{ mensagemErro }}
    </div>
    <div v-if="pedidoFinalizado" class="alert alert-success" role="status">
      <strong>Pedido finalizado!</strong> Obrigado pela sua compra. Seu carrinho está vazio.
    </div>

    <div v-if="carregando" class="text-center py-5" role="status">
      <span class="spinner-border" aria-hidden="true"></span>
      <p class="mt-3">Carregando carrinho...</p>
    </div>
    <div v-else-if="itens.length === 0" class="text-center py-5">
      <i class="bi bi-cart-x display-3 text-secondary" aria-hidden="true"></i>
      <h2 class="h4 mt-3">Seu carrinho está vazio</h2>
      <p class="text-body-secondary">Escolha seus Funkos favoritos e adicione ao pedido.</p>
      <RouterLink class="btn btn-primary mt-2" to="/">Explorar Funkos</RouterLink>
    </div>

    <div v-else class="row g-4 align-items-start">
      <div class="col-lg-8">
        <article
          v-for="item in itens"
          :key="item.id"
          class="card border-0 shadow-sm mb-3"
        >
          <div class="card-body d-flex flex-wrap align-items-center gap-3">
            <img
              v-if="item.imagem"
              :src="item.imagem"
              :alt="item.nome"
              class="cart-product-image"
              @error="$event.currentTarget.hidden = true"
            />
            <i v-else class="bi bi-box-seam fs-1 text-secondary" aria-hidden="true"></i>
            <div class="flex-grow-1">
              <p class="text-uppercase small text-secondary mb-1">
                {{ item.personagem || 'Funko Pop' }}
              </p>
              <h2 class="h5 mb-1">{{ item.nome }}</h2>
              <p class="text-body-secondary mb-2">{{ formatarPreco(item.preco) }} cada</p>
              <div class="d-flex align-items-center gap-2">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  type="button"
                  :aria-label="`Diminuir quantidade de ${item.nome}`"
                  :disabled="item.quantidade <= 1"
                  @click="alterarQuantidade(item, item.quantidade - 1)"
                >
                  <i class="bi bi-dash" aria-hidden="true"></i>
                </button>
                <span aria-live="polite">{{ item.quantidade }}</span>
                <button
                  class="btn btn-sm btn-outline-secondary"
                  type="button"
                  :aria-label="`Aumentar quantidade de ${item.nome}`"
                  :disabled="item.quantidade >= item.estoque"
                  @click="alterarQuantidade(item, item.quantidade + 1)"
                >
                  <i class="bi bi-plus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <div class="d-flex flex-column align-items-end gap-3 ms-auto">
              <strong>{{ formatarPreco(item.preco * item.quantidade) }}</strong>
              <button
                class="btn btn-link text-danger p-0"
                type="button"
                :aria-label="`Excluir ${item.nome} do pedido`"
                @click="removerItem(item)"
              >
                <i class="bi bi-trash3 me-1" aria-hidden="true"></i>Excluir
              </button>
            </div>
          </div>
        </article>
      </div>

      <aside class="col-lg-4" aria-labelledby="resumo-titulo">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h2 id="resumo-titulo" class="h5 fw-bold mb-4">Resumo do pedido</h2>
            <div class="d-flex justify-content-between mb-3">
              <span>Subtotal ({{ quantidadeItens }} itens)</span>
              <span>{{ formatarPreco(valorTotal) }}</span>
            </div>
            <div class="d-flex justify-content-between text-body-secondary mb-3">
              <span>Frete</span><span>Calculado na finalização</span>
            </div>
            <hr />
            <div class="d-flex justify-content-between mb-4">
              <strong>Total</strong><strong>{{ formatarPreco(valorTotal) }}</strong>
            </div>
            <button class="btn btn-primary w-100" type="button" @click="finalizarPedido">
              <i class="bi bi-check2-circle me-1" aria-hidden="true"></i>
              Finalizar pedido
            </button>
            <button
              class="btn btn-outline-danger w-100 mt-2"
              type="button"
              @click="apagarPedido"
            >
              <i class="bi bi-trash3 me-1" aria-hidden="true"></i>
              Apagar pedido
            </button>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.cart-product-image {
  width: 100px;
  height: 100px;
  border-radius: 0.75rem;
  background: #fff3ec;
  object-fit: contain;
  padding: 0.5rem;
}
</style>
