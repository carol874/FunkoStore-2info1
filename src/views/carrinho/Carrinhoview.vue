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

defineOptions({ name: 'CarrinhoView' });

const itens = ref([]);
const carregando = ref(true);
const mensagemErro = ref('');
const mensagemSucesso = ref('');
const pedidoCriado = ref(null);
const exibindoCheckout = ref(false);
const salvandoPedido = ref(false);
const dadosCheckout = ref({
  nome: '',
  email: '',
  telefone: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pagamento: 'Pix',
});

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
    mensagemErro.value =
      erro.message || 'Não foi possível carregar o carrinho.';
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
  mensagemSucesso.value = '';

  try {
    itens.value = atualizarQuantidade(item.id, quantidade);
  } catch (erro) {
    console.error('Erro ao atualizar quantidade do carrinho:', erro);
    mensagemErro.value =
      erro.message || 'Não foi possível atualizar a quantidade.';
  }
}

function removerItem(item) {
  mensagemErro.value = '';
  mensagemSucesso.value = '';

  try {
    itens.value = removerDoCarrinho(item.id);
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
    exibindoCheckout.value = false;
    mensagemSucesso.value = '';
  } catch (erro) {
    console.error('Erro ao apagar o pedido:', erro);
    mensagemErro.value = erro.message || 'Não foi possível apagar o pedido.';
  }
}

function abrirCheckout() {
  mensagemErro.value = '';
  exibindoCheckout.value = true;
}

async function finalizarPedido() {
  if (itens.value.length === 0 || salvandoPedido.value) return;

  mensagemErro.value = '';
  mensagemSucesso.value = '';
  salvandoPedido.value = true;

  try {
    const pedido = await criarPedido({
      dataPedido: new Date().toISOString(),
      valorTotal: valorTotal.value,
      status: 'Pendente',
      cliente: {
        nome: dadosCheckout.value.nome.trim(),
        email: dadosCheckout.value.email.trim(),
        telefone: dadosCheckout.value.telefone.trim(),
      },
      enderecoEntrega: {
        cep: dadosCheckout.value.cep.trim(),
        logradouro: dadosCheckout.value.logradouro.trim(),
        numero: dadosCheckout.value.numero.trim(),
        complemento: dadosCheckout.value.complemento.trim(),
        bairro: dadosCheckout.value.bairro.trim(),
        cidade: dadosCheckout.value.cidade.trim(),
        estado: dadosCheckout.value.estado.trim().toUpperCase(),
      },
      formaPagamento: dadosCheckout.value.pagamento,
      itens: itens.value.map((item) => ({
        produtoId: item.id,
        nome: item.nome,
        personagem: item.personagem,
        imagem: item.imagem,
        precoUnitario: Number(item.preco),
        quantidade: item.quantidade,
        subtotal: Number(item.preco) * item.quantidade,
      })),
    });

    pedidoCriado.value = pedido;
    exibindoCheckout.value = false;

    try {
      itens.value = esvaziarCarrinho();
      mensagemSucesso.value = 'Pedido registrado com sucesso.';
    } catch (erro) {
      console.error(
        'O pedido foi criado, mas não foi possível limpar o carrinho:',
        erro,
      );
      mensagemErro.value =
        'O pedido foi registrado, mas não foi possível limpar o carrinho.';
    }
  } catch (erro) {
    console.error('Erro ao finalizar o pedido:', erro);
    mensagemErro.value = erro.message || 'Não foi possível finalizar o pedido.';
  } finally {
    salvandoPedido.value = false;
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
    <header
      class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"
    >
      <div>
        <h1 class="h2 fw-bold mb-1">Meu carrinho</h1>
        <p class="text-body-secondary mb-0">
          {{ quantidadeItens }}
          {{ quantidadeItens === 1 ? 'Funko' : 'Funkos' }} no pedido
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
      <RouterLink
        v-if="pedidoCriado?.id"
        class="alert-link ms-1"
        to="/pedidos"
      >
        Ver pedidos
      </RouterLink>
    </div>
    <div
      v-if="mensagemSucesso"
      class="alert alert-success"
      role="status"
    >
      <strong>{{ mensagemSucesso }}</strong>
      <RouterLink
        v-if="pedidoCriado?.id"
        class="alert-link ms-1"
        :to="`/pedidos/${pedidoCriado.id}`"
      >
        Ver pedido #{{ pedidoCriado.id }}
      </RouterLink>
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
      <p class="mt-3">Carregando carrinho...</p>
    </div>
    <div
      v-else-if="itens.length === 0"
      class="text-center py-5"
    >
      <i
        class="bi bi-cart-x display-3 text-secondary"
        aria-hidden="true"
      ></i>
      <h2 class="h4 mt-3">Seu carrinho está vazio</h2>
      <p class="text-body-secondary">
        Escolha seus Funkos favoritos e adicione ao pedido.
      </p>
      <RouterLink
        class="btn btn-primary mt-2"
        to="/"
        >Explorar Funkos</RouterLink
      >
    </div>

    <template v-else>
      <div class="row g-4 align-items-start">
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
              <i
                v-else
                class="bi bi-box-seam fs-1 text-secondary"
                aria-hidden="true"
              ></i>
              <div class="flex-grow-1">
                <p class="text-uppercase small text-secondary mb-1">
                  {{ item.personagem || 'Funko Pop' }}
                </p>
                <h2 class="h5 mb-1">{{ item.nome }}</h2>
                <p class="text-body-secondary mb-2">
                  {{ formatarPreco(item.preco) }} cada
                </p>
                <div class="d-flex align-items-center gap-2">
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    type="button"
                    :aria-label="`Diminuir quantidade de ${item.nome}`"
                    :disabled="item.quantidade <= 1"
                    @click="alterarQuantidade(item, item.quantidade - 1)"
                  >
                    <i
                      class="bi bi-dash"
                      aria-hidden="true"
                    ></i>
                  </button>
                  <span aria-live="polite">{{ item.quantidade }}</span>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    type="button"
                    :aria-label="`Aumentar quantidade de ${item.nome}`"
                    :disabled="item.quantidade >= item.estoque"
                    @click="alterarQuantidade(item, item.quantidade + 1)"
                  >
                    <i
                      class="bi bi-plus"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>
              <div class="d-flex flex-column align-items-end gap-3 ms-auto">
                <strong>{{
                  formatarPreco(item.preco * item.quantidade)
                }}</strong>
                <button
                  class="btn btn-link text-danger p-0"
                  type="button"
                  :aria-label="`Excluir ${item.nome} do pedido`"
                  @click="removerItem(item)"
                >
                  <i
                    class="bi bi-trash3 me-1"
                    aria-hidden="true"
                  ></i
                  >Excluir
                </button>
              </div>
            </div>
          </article>
        </div>

        <aside
          class="col-lg-4"
          aria-labelledby="resumo-titulo"
        >
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h2
                id="resumo-titulo"
                class="h5 fw-bold mb-4"
              >
                Resumo do pedido
              </h2>
              <div class="d-flex justify-content-between mb-3">
                <span>Subtotal ({{ quantidadeItens }} itens)</span>
                <span>{{ formatarPreco(valorTotal) }}</span>
              </div>
              <div
                class="d-flex justify-content-between text-body-secondary mb-3"
              >
                <span>Frete</span><span>Calculado na finalização</span>
              </div>
              <hr />
              <div class="d-flex justify-content-between mb-4">
                <strong>Total</strong
                ><strong>{{ formatarPreco(valorTotal) }}</strong>
              </div>
              <button
                class="btn btn-primary w-100"
                type="button"
                @click="abrirCheckout"
              >
                <i
                  class="bi bi-check2-circle me-1"
                  aria-hidden="true"
                ></i>
                Finalizar pedido
              </button>
              <button
                class="btn btn-outline-danger w-100 mt-2"
                type="button"
                @click="apagarPedido"
              >
                <i
                  class="bi bi-trash3 me-1"
                  aria-hidden="true"
                ></i>
                Apagar pedido
              </button>
            </div>
          </div>
        </aside>
      </div>

      <form
        v-if="exibindoCheckout"
        class="card border-0 shadow-sm mt-4"
        @submit.prevent="finalizarPedido"
      >
        <div class="card-body p-4">
          <h2 class="h4 fw-bold mb-4">Dados para entrega</h2>
          <div class="row g-3">
            <div class="col-md-6">
              <label
                class="form-label"
                for="checkout-nome"
                >Nome completo</label
              >
              <input
                id="checkout-nome"
                v-model="dadosCheckout.nome"
                class="form-control"
                autocomplete="name"
                maxlength="120"
                required
              />
            </div>
            <div class="col-md-6">
              <label
                class="form-label"
                for="checkout-email"
                >E-mail</label
              >
              <input
                id="checkout-email"
                v-model="dadosCheckout.email"
                class="form-control"
                type="email"
                autocomplete="email"
                maxlength="160"
                required
              />
            </div>
            <div class="col-md-4">
              <label
                class="form-label"
                for="checkout-telefone"
                >Telefone</label
              >
              <input
                id="checkout-telefone"
                v-model="dadosCheckout.telefone"
                class="form-control"
                type="tel"
                autocomplete="tel"
                maxlength="30"
              />
            </div>
            <div class="col-md-4">
              <label
                class="form-label"
                for="checkout-cep"
                >CEP</label
              >
              <input
                id="checkout-cep"
                v-model="dadosCheckout.cep"
                class="form-control"
                autocomplete="postal-code"
                maxlength="12"
                required
              />
            </div>
            <div class="col-md-8">
              <label
                class="form-label"
                for="checkout-logradouro"
                >Rua / Avenida</label
              >
              <input
                id="checkout-logradouro"
                v-model="dadosCheckout.logradouro"
                class="form-control"
                autocomplete="address-line1"
                maxlength="160"
                required
              />
            </div>
            <div class="col-md-4">
              <label
                class="form-label"
                for="checkout-numero"
                >Número</label
              >
              <input
                id="checkout-numero"
                v-model="dadosCheckout.numero"
                class="form-control"
                autocomplete="address-line2"
                maxlength="20"
                required
              />
            </div>
            <div class="col-md-4">
              <label
                class="form-label"
                for="checkout-complemento"
                >Complemento</label
              >
              <input
                id="checkout-complemento"
                v-model="dadosCheckout.complemento"
                class="form-control"
                maxlength="100"
              />
            </div>
            <div class="col-md-4">
              <label
                class="form-label"
                for="checkout-bairro"
                >Bairro</label
              >
              <input
                id="checkout-bairro"
                v-model="dadosCheckout.bairro"
                class="form-control"
                maxlength="100"
                required
              />
            </div>
            <div class="col-md-5">
              <label
                class="form-label"
                for="checkout-cidade"
                >Cidade</label
              >
              <input
                id="checkout-cidade"
                v-model="dadosCheckout.cidade"
                class="form-control"
                autocomplete="address-level2"
                maxlength="100"
                required
              />
            </div>
            <div class="col-md-3">
              <label
                class="form-label"
                for="checkout-estado"
                >Estado (UF)</label
              >
              <input
                id="checkout-estado"
                v-model="dadosCheckout.estado"
                class="form-control text-uppercase"
                autocomplete="address-level1"
                minlength="2"
                maxlength="2"
                pattern="[A-Za-z]{2}"
                required
              />
            </div>
            <div class="col-md-4">
              <label
                class="form-label"
                for="checkout-pagamento"
                >Forma de pagamento</label
              >
              <select
                id="checkout-pagamento"
                v-model="dadosCheckout.pagamento"
                class="form-select"
                required
              >
                <option>Pix</option>
                <option>Cartão de crédito</option>
                <option>Boleto</option>
              </select>
            </div>
          </div>
          <p class="small text-body-secondary mt-3 mb-0">
            Esta etapa registra o pedido; o pagamento não é processado pelo
            sistema.
          </p>
          <div class="d-flex flex-wrap gap-2 mt-4">
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="salvandoPedido"
            >
              <span
                v-if="salvandoPedido"
                class="spinner-border spinner-border-sm me-1"
                aria-hidden="true"
              ></span>
              {{
                salvandoPedido ? 'Registrando pedido...' : 'Confirmar pedido'
              }}
            </button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              :disabled="salvandoPedido"
              @click="exibindoCheckout = false"
            >
              Voltar ao carrinho
            </button>
          </div>
        </div>
      </form>
    </template>
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
