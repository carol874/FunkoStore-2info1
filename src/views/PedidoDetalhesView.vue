<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import {
  atualizarPedido,
  buscarPedido,
  excluirPedido,
  STATUS_PEDIDO,
} from '@/services/pedidos';

defineOptions({ name: 'PedidoDetalhesView' });

const route = useRoute();
const router = useRouter();
const pedido = ref(null);
const carregando = ref(true);
const salvando = ref(false);
const excluindo = ref(false);
const mensagemErro = ref('');
const mensagemSucesso = ref('');
const statusSelecionado = ref('');
const statusInicial = computed(() => pedido.value?.status || '');

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

async function carregarPedido() {
  carregando.value = true;
  mensagemErro.value = '';

  try {
    pedido.value = await buscarPedido(route.params.id);
    statusSelecionado.value = pedido.value.status || STATUS_PEDIDO[0];
  } catch (erro) {
    console.error('Erro ao carregar o pedido:', erro);
    mensagemErro.value =
      erro.message || 'Não foi possível carregar este pedido.';
  } finally {
    carregando.value = false;
  }
}

async function salvarStatus() {
  if (
    !pedido.value ||
    salvando.value ||
    statusSelecionado.value === statusInicial.value
  ) {
    return;
  }

  salvando.value = true;
  mensagemErro.value = '';
  mensagemSucesso.value = '';

  try {
    pedido.value = await atualizarPedido(pedido.value.id, {
      status: statusSelecionado.value,
    });
    mensagemSucesso.value = 'Status do pedido atualizado.';
  } catch (erro) {
    console.error('Erro ao atualizar o pedido:', erro);
    mensagemErro.value = erro.message || 'Não foi possível atualizar o pedido.';
  } finally {
    salvando.value = false;
  }
}

async function removerPedido() {
  if (
    !pedido.value ||
    excluindo.value ||
    !window.confirm(`Deseja excluir o pedido #${pedido.value.id}?`)
  ) {
    return;
  }

  excluindo.value = true;
  mensagemErro.value = '';

  try {
    await excluirPedido(pedido.value.id);
    await router.push('/pedidos');
  } catch (erro) {
    console.error('Erro ao excluir o pedido:', erro);
    mensagemErro.value = erro.message || 'Não foi possível excluir o pedido.';
  } finally {
    excluindo.value = false;
  }
}

onMounted(carregarPedido);
</script>

<template>
  <section class="container py-5">
    <header
      class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"
    >
      <div>
        <h1 class="h2 fw-bold mb-1">
          {{ pedido ? `Pedido #${pedido.id}` : 'Detalhes do pedido' }}
        </h1>
        <p
          v-if="pedido"
          class="text-body-secondary mb-0"
        >
          Realizado em {{ formatarData(pedido.dataPedido) }}
        </p>
      </div>
      <RouterLink
        class="btn btn-outline-secondary"
        to="/pedidos"
      >
        <i
          class="bi bi-arrow-left me-1"
          aria-hidden="true"
        ></i>
        Voltar aos pedidos
      </RouterLink>
    </header>

    <div
      v-if="mensagemErro"
      class="alert alert-danger"
      role="alert"
    >
      {{ mensagemErro }}
      <button
        v-if="!pedido"
        class="btn btn-sm btn-outline-danger ms-2"
        type="button"
        @click="carregarPedido"
      >
        Tentar novamente
      </button>
    </div>
    <div
      v-if="mensagemSucesso"
      class="alert alert-success"
      role="status"
    >
      {{ mensagemSucesso }}
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
      <p class="mt-3">Carregando pedido...</p>
    </div>
    <div
      v-else-if="pedido"
      class="row g-4 align-items-start"
    >
      <div class="col-lg-8">
        <section
          class="card border-0 shadow-sm mb-4"
          aria-labelledby="itens-titulo"
        >
          <div class="card-body p-4">
            <h2
              id="itens-titulo"
              class="h5 fw-bold mb-3"
            >
              Itens do pedido
            </h2>
            <div
              v-for="item in pedido.itens || []"
              :key="item.produtoId"
              class="d-flex align-items-center gap-3 py-3 border-bottom"
            >
              <img
                v-if="item.imagem"
                :src="item.imagem"
                :alt="item.nome"
                class="order-product-image"
                @error="$event.currentTarget.hidden = true"
              />
              <i
                v-else
                class="bi bi-box-seam fs-2 text-secondary"
                aria-hidden="true"
              ></i>
              <div class="flex-grow-1">
                <h3 class="h6 mb-1">{{ item.nome }}</h3>
                <p class="small text-body-secondary mb-0">
                  {{ item.quantidade }} x
                  {{ formatarPreco(item.precoUnitario) }}
                </p>
              </div>
              <strong>{{ formatarPreco(item.subtotal) }}</strong>
            </div>
            <div class="d-flex justify-content-between mt-3">
              <strong>Total</strong>
              <strong>{{ formatarPreco(pedido.valorTotal) }}</strong>
            </div>
          </div>
        </section>

        <section
          class="card border-0 shadow-sm"
          aria-labelledby="entrega-titulo"
        >
          <div class="card-body p-4">
            <h2
              id="entrega-titulo"
              class="h5 fw-bold mb-3"
            >
              Entrega e cliente
            </h2>
            <p class="mb-1">
              <strong>{{ pedido.cliente?.nome }}</strong>
            </p>
            <p class="mb-3">
              {{ pedido.cliente?.email
              }}<span v-if="pedido.cliente?.telefone">
                &middot; {{ pedido.cliente.telefone }}</span
              >
            </p>
            <p class="mb-0">
              {{ pedido.enderecoEntrega?.logradouro }},
              {{ pedido.enderecoEntrega?.numero }}
              <span v-if="pedido.enderecoEntrega?.complemento"
                >, {{ pedido.enderecoEntrega.complemento }}</span
              >
              <br />
              <span v-if="pedido.enderecoEntrega?.bairro"
                >{{ pedido.enderecoEntrega.bairro }} &middot;
              </span>
              {{ pedido.enderecoEntrega?.cidade }} -
              {{ pedido.enderecoEntrega?.estado }}
              <br />
              <span v-if="pedido.enderecoEntrega?.cep"
                >CEP {{ pedido.enderecoEntrega.cep }}</span
              >
            </p>
            <p class="small text-body-secondary mt-3 mb-0">
              Pagamento: {{ pedido.formaPagamento || 'Não informado' }}
            </p>
          </div>
        </section>
      </div>

      <aside
        class="col-lg-4"
        aria-labelledby="gerenciar-titulo"
      >
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h2
              id="gerenciar-titulo"
              class="h5 fw-bold mb-3"
            >
              Gerenciar pedido
            </h2>
            <label
              class="form-label"
              for="status-pedido"
              >Status</label
            >
            <select
              id="status-pedido"
              v-model="statusSelecionado"
              class="form-select"
            >
              <option
                v-for="status in STATUS_PEDIDO"
                :key="status"
              >
                {{ status }}
              </option>
            </select>
            <button
              class="btn btn-primary w-100 mt-3"
              type="button"
              :disabled="salvando || statusSelecionado === statusInicial"
              @click="salvarStatus"
            >
              {{ salvando ? 'Salvando...' : 'Atualizar status' }}
            </button>
            <hr />
            <button
              class="btn btn-outline-danger w-100"
              type="button"
              :disabled="excluindo"
              @click="removerPedido"
            >
              {{ excluindo ? 'Excluindo...' : 'Excluir pedido' }}
            </button>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.order-product-image {
  width: 72px;
  height: 72px;
  border-radius: 0.75rem;
  background: #fff3ec;
  object-fit: contain;
  padding: 0.4rem;
}
</style>
