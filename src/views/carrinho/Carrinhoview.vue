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
import { criarPedido } from '@/services/pedidos';
import { listarUsuarios } from '@/services/usuarios';

const itens = ref([]);
const carregando = ref(true);
const mensagemErro = ref('');
const mensagemSucesso = ref('');
const finalizando = ref(false);
const dadosEntrega = ref({
  email: '',
  logradouro: '',
  numero: '',
  cidade: '',
  estado: '',
});
const pedidoCriado = ref(null);

const quantidadeItens = computed(() => {
  return itens.value.reduce((total, item) => total + Number(item.quantidade), 0);
});

const valorTotal = computed(() => {
  return itens.value.reduce(
    (total, item) => total + Number(item.preco) * Number(item.quantidade),
    0,
  );
});

async function carregarCarrinho() {
  mensagemErro.value = '';

  try {
    itens.value = await lerCarrinho();
  } catch (erro) {
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

async function alterarQuantidade(item, quantidade) {
  mensagemErro.value = '';

  try {
    itens.value = await atualizarQuantidade(item.id, quantidade);
  } catch (erro) {
    mensagemErro.value = erro.message || 'Não foi possível atualizar a quantidade.';
  }
}

async function removerItem(item) {
  mensagemErro.value = '';

  try {
    itens.value = await removerDoCarrinho(item.id);
  } catch (erro) {
    mensagemErro.value = erro.message || 'Não foi possível remover este Funko.';
  }
}

async function apagarPedido() {
  if (!window.confirm('Deseja apagar todos os Funkos do carrinho?')) return;

  try {
    itens.value = await esvaziarCarrinho();
  } catch (erro) {
    mensagemErro.value = erro.message || 'Não foi possível esvaziar o carrinho.';
  }
}

async function finalizarPedido() {
  mensagemErro.value = '';
  mensagemSucesso.value = '';

  if (itens.value.length === 0) {
    mensagemErro.value = 'Seu carrinho está vazio.';
    return;
  }

  finalizando.value = true;

  try {
    const usuarios = await listarUsuarios();

    const usuario = usuarios.find(
      item => item.email?.trim().toLowerCase() === dadosEntrega.value.email.trim().toLowerCase()
    );

    if (!usuario) {
      throw new Error('Este e-mail não está cadastrado. Faça seu cadastro antes de comprar.');
    }

    const pedido = await criarPedido({
      usuarioId: usuario.id,
      dataPedido: new Date().toISOString(),
      valorTotal: valorTotal.value,
      status: 'Pendente',

      cliente: {
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || '',
      },

      enderecoEntrega: {
        logradouro: dadosEntrega.value.logradouro,
        numero: dadosEntrega.value.numero,
        cidade: dadosEntrega.value.cidade,
        estado: dadosEntrega.value.estado,
      },

      formaPagamento: 'Não informado',

      itens: itens.value.map(item => ({
        produtoId: String(item.funkoId),
        nome: item.nome,
        personagem: item.personagem || '',
        imagem: item.imagem || '',
        precoUnitario: Number(item.preco),
        quantidade: Number(item.quantidade),
        subtotal: Number(item.preco) * Number(item.quantidade),
      })),
    });

    pedidoCriado.value = pedido.id;

    await esvaziarCarrinho();

    itens.value = [];
    mensagemSucesso.value = 'Compra registrada com sucesso!';
  } catch (erro) {
    mensagemErro.value = erro.message || 'Não foi possível finalizar o pedido.';
  } finally {
    finalizando.value = false;
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
      <RouterLink class="btn btn-outline-secondary" to="/">Continuar comprando</RouterLink>
    </header>

    <div v-if="mensagemErro" class="alert alert-danger" role="alert">
      {{ mensagemErro }}
    </div>
    <div v-if="mensagemSucesso" class="alert alert-success" role="status">
      {{ mensagemSucesso }}
      <RouterLink v-if="pedidoCriado" class="alert-link ms-1" :to="`/pedidos/${pedidoCriado}`">
        Ver pedido
      </RouterLink>
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
      <div class="col-lg-7">
        <article v-for="item in itens" :key="item.id" class="card border-0 shadow-sm mb-3">
          <div class="card-body d-flex flex-wrap align-items-center gap-3">
            <img
              v-if="item.imagem"
              :src="item.imagem"
              :alt="item.nome"
              class="cart-product-image"
              @error="$event.currentTarget.hidden = true"
            />
            <div class="flex-grow-1">
              <p class="small text-secondary mb-1">{{ item.personagem || 'Funko Pop' }}</p>
              <h2 class="h5 mb-1">{{ item.nome }}</h2>
              <p class="text-body-secondary mb-2">{{ formatarPreco(item.preco) }} cada</p>
              <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-secondary" type="button" :disabled="item.quantidade <= 1" @click="alterarQuantidade(item, item.quantidade - 1)">-</button>
                <span>{{ item.quantidade }}</span>
                <button class="btn btn-sm btn-outline-secondary" type="button" :disabled="item.quantidade >= item.estoque" @click="alterarQuantidade(item, item.quantidade + 1)">+</button>
              </div>
            </div>
            <div class="ms-auto text-end">
              <strong>{{ formatarPreco(item.preco * item.quantidade) }}</strong>
              <div>
                <button class="btn btn-link text-danger p-0 mt-2" type="button" @click="removerItem(item)">
                  <i class="bi bi-trash3 me-1"></i>Excluir
                </button>
              </div>
            </div>
          </div>
        </article>

        <button class="btn btn-outline-danger" type="button" @click="apagarPedido">
          Esvaziar carrinho
        </button>
      </div>

      <aside class="col-lg-5">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h2 class="h5 fw-bold mb-3">Finalizar compra</h2>
            <div class="d-flex justify-content-between mb-3">
              <span>Subtotal ({{ quantidadeItens }} itens)</span>
              <strong>{{ formatarPreco(valorTotal) }}</strong>
            </div>
            <hr />
            <p class="small text-muted">Use o mesmo e-mail do seu cadastro para registrar a compra.</p>
            <form @submit.prevent="finalizarPedido">
              <div class="mb-3">
                <label for="email-pedido" class="form-label">E-mail cadastrado</label>
                <input id="email-pedido" v-model="dadosEntrega.email" class="form-control" type="email" required />
              </div>
              <div class="mb-3">
                <label for="logradouro-pedido" class="form-label">Rua</label>
                <input id="logradouro-pedido" v-model="dadosEntrega.logradouro" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="numero-pedido" class="form-label">Número</label>
                <input id="numero-pedido" v-model="dadosEntrega.numero" class="form-control" required />
              </div>
              <div class="row g-2">
                <div class="col-8 mb-3">
                  <label for="cidade-pedido" class="form-label">Cidade</label>
                  <input id="cidade-pedido" v-model="dadosEntrega.cidade" class="form-control" required />
                </div>
                <div class="col-4 mb-3">
                  <label for="estado-pedido" class="form-label">Estado</label>
                  <input id="estado-pedido" v-model="dadosEntrega.estado" class="form-control" maxlength="2" required />
                </div>
              </div>
              <button class="btn btn-danger w-100" type="submit" :disabled="finalizando">
                {{ finalizando ? 'Finalizando...' : 'Confirmar compra' }}
              </button>
            </form>
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
