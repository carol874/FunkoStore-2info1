<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { listarPedidos } from '@/services/pedidos';

defineOptions({ name: 'PedidosView' });

const pedidos = ref([]);
const carregando = ref(true);
const mensagemErro = ref('');
const filtroStatus = ref('');

const pedidosFiltrados = computed(() => {
  const filtrados = filtroStatus.value
    ? pedidos.value.filter((pedido) => pedido.status === filtroStatus.value)
    : pedidos.value;

  return [...filtrados].sort(
    (a, b) => new Date(b.dataPedido) - new Date(a.dataPedido),
  );
});

function formatarPreco(preco) {
  return Number(preco || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatarData(data) {
  const dataPedido = new Date(data);

  return Number.isNaN(dataPedido.getTime())
    ? 'Data indisponível'
    : dataPedido.toLocaleString('pt-BR');
}

async function carregarPedidos() {
  carregando.value = true;
  mensagemErro.value = '';

  try {
    pedidos.value = await listarPedidos();
  } catch (erro) {
    console.error('Erro ao carregar pedidos:', erro);
    mensagemErro.value =
      erro.message || 'Não foi possível carregar os pedidos.';
  } finally {
    carregando.value = false;
  }
}

onMounted(carregarPedidos);
</script>

<template>
  <section class="container py-5">
    <header
      class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"
    >
      <div>
        <h1 class="h2 fw-bold mb-1">Pedidos</h1>
        <p class="text-body-secondary mb-0">
          Histórico e acompanhamento das compras
        </p>
      </div>
      <RouterLink
        class="btn btn-outline-secondary"
        to="/"
      >
        <i
          class="bi bi-arrow-left me-1"
          aria-hidden="true"
        ></i>
        Continuar comprando
      </RouterLink>
    </header>

    <div
      v-if="mensagemErro"
      class="alert alert-danger"
      role="alert"
    >
      {{ mensagemErro }}
      <button
        class="btn btn-sm btn-outline-danger ms-2"
        type="button"
        @click="carregarPedidos"
      >
        Tentar novamente
      </button>
    </div>

    <div class="row align-items-end mb-3">
      <div class="col-sm-6 col-md-4">
        <label
          class="form-label"
          for="filtro-status"
          >Filtrar por status</label
        >
        <select
          id="filtro-status"
          v-model="filtroStatus"
          class="form-select"
        >
          <option value="">Todos os pedidos</option>
          <option>Pendente</option>
          <option>Confirmado</option>
          <option>Enviado</option>
          <option>Entregue</option>
          <option>Cancelado</option>
        </select>
      </div>
    </div>

    <div
      v-if="carregando"
      class="text-center py-5"
      role="status"
    >
      <span
        class="spinner-border"
        aria-hidden="true"
      ></span>
      <p class="mt-3">Carregando pedidos...</p>
    </div>
    <div
      v-else-if="!pedidosFiltrados.length"
      class="text-center py-5"
    >
      <i
        class="bi bi-receipt display-3 text-secondary"
        aria-hidden="true"
      ></i>
      <h2 class="h4 mt-3">
        {{
          pedidos.length
            ? 'Nenhum pedido com esse status'
            : 'Você ainda não tem pedidos'
        }}
      </h2>
      <p class="text-body-secondary">
        {{
          pedidos.length
            ? 'Altere o filtro para ver outros pedidos.'
            : 'Suas compras aparecerão aqui.'
        }}
      </p>
      <RouterLink
        v-if="!pedidos.length"
        class="btn btn-primary"
        to="/"
      >
        Explorar Funkos
      </RouterLink>
    </div>

    <div
      v-else
      class="d-grid gap-3"
    >
      <article
        v-for="pedido in pedidosFiltrados"
        :key="pedido.id"
        class="card border-0 shadow-sm"
      >
        <div class="card-body d-flex flex-wrap align-items-center gap-3">
          <div class="flex-grow-1">
            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h2 class="h5 mb-0">Pedido #{{ pedido.id }}</h2>
              <span class="badge text-bg-secondary">{{ pedido.status }}</span>
            </div>
            <p class="mb-1">{{ pedido.cliente?.nome || 'Cliente' }}</p>
            <p class="small text-body-secondary mb-0">
              {{ formatarData(pedido.dataPedido) }}
              &middot;
              {{ pedido.itens?.length || 0 }}
              {{ pedido.itens?.length === 1 ? 'produto' : 'produtos' }}
            </p>
          </div>
          <strong>{{ formatarPreco(pedido.valorTotal) }}</strong>
          <RouterLink
            class="btn btn-outline-primary"
            :to="`/pedidos/${pedido.id}`"
          >
            Detalhes
          </RouterLink>
        </div>
      </article>
    </div>
  </section>
</template>
