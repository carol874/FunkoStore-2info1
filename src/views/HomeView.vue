<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { adicionarAoCarrinho } from '@/services/carrinho';
import { listarCategorias } from '@/services/categorias';
import { listarFunkos } from '@/services/funkos';

const funkos = ref([]);
const categorias = ref([]);
const carregando = ref(true);
const mensagemErro = ref('');
const mensagemSucesso = ref('');
const busca = ref('');
const categoriaSelecionada = ref('');
const adicionandoId = ref(null);

const funkosFiltrados = computed(() => {
  const termo = busca.value.trim().toLocaleLowerCase('pt-BR');

  return funkos.value.filter((funko) => {
    const correspondeBusca =
      !termo ||
      `${funko.nome || ''} ${funko.personagem || ''}`
        .toLocaleLowerCase('pt-BR')
        .includes(termo);
    const correspondeCategoria =
      !categoriaSelecionada.value ||
      String(funko.categoriaId) === String(categoriaSelecionada.value);

    return correspondeBusca && correspondeCategoria;
  });
});

async function carregarDados() {
  carregando.value = true;
  mensagemErro.value = '';

  try {
    const [listaFunkos, listaCategorias] = await Promise.all([
      listarFunkos(),
      listarCategorias(),
    ]);

    funkos.value = listaFunkos;
    categorias.value = listaCategorias;
  } catch (erro) {
    console.error('Erro ao carregar a página inicial:', erro);
    mensagemErro.value = erro.message || 'Não foi possível carregar os Funkos.';
  } finally {
    carregando.value = false;
  }
}

function nomeCategoria(id) {
  return (
    categorias.value.find((categoria) => String(categoria.id) === String(id))
      ?.nome || 'Sem categoria'
  );
}

function formatarPreco(preco) {
  return Number(preco || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function imagemIndisponivel(evento) {
  evento.currentTarget.hidden = true;
}

function adicionarFunko(funko) {
  mensagemErro.value = '';
  mensagemSucesso.value = '';
  adicionandoId.value = funko.id;

  try {
    adicionarAoCarrinho(funko);
    mensagemSucesso.value = `${funko.nome} foi adicionado ao carrinho.`;
  } catch (erro) {
    console.error('Erro ao adicionar Funko ao carrinho:', erro);
    mensagemErro.value = erro.message || 'Não foi possível adicionar ao carrinho.';
  } finally {
    adicionandoId.value = null;
  }
}

onMounted(carregarDados);
</script>

<template>
  <div class="storefront">
    <section class="storefront-hero">
      <div class="container hero-content">
        <div>
          <span class="hero-eyebrow">Sua coleção começa aqui</span>
          <h1>Encontre seu próximo <span>Funko Pop!</span></h1>
          <p>Personagens inesquecíveis para dar vida à sua coleção.</p>
          <RouterLink class="btn hero-button" :to="{ name: 'addFunkos' }">
            <i class="bi bi-plus-lg" aria-hidden="true"></i>
            Cadastrar Funko
          </RouterLink>
        </div>
        <div class="hero-art" aria-hidden="true">
          <i class="bi bi-stars"></i>
          <span>POP!</span>
          <i class="bi bi-heart-fill"></i>
        </div>
      </div>
    </section>

    <section class="container catalog-section" aria-labelledby="catalog-title">
      <div class="catalog-heading">
        <div>
          <span class="section-eyebrow">Escolha o seu favorito</span>
          <h2 id="catalog-title">Nossa coleção</h2>
        </div>
        <span class="product-count">
          {{ funkosFiltrados.length }}
          {{ funkosFiltrados.length === 1 ? 'produto' : 'produtos' }}
        </span>
      </div>

      <div class="catalog-filters">
        <label class="search-field">
          <i class="bi bi-search" aria-hidden="true"></i>
          <span class="visually-hidden">Buscar por nome ou personagem</span>
          <input
            v-model="busca"
            type="search"
            placeholder="Buscar por nome ou personagem..."
          />
        </label>
        <label class="category-field">
          <i class="bi bi-filter" aria-hidden="true"></i>
          <span class="visually-hidden">Filtrar por categoria</span>
          <select v-model="categoriaSelecionada">
            <option value="">Todas as categorias</option>
            <option
              v-for="categoria in categorias"
              :key="categoria.id"
              :value="categoria.id"
            >
              {{ categoria.nome }}
            </option>
          </select>
        </label>
      </div>

      <div v-if="mensagemErro" class="alert alert-danger" role="alert">
        {{ mensagemErro }}
        <button
          class="btn btn-sm btn-outline-danger ms-2"
          type="button"
          @click="carregarDados"
        >
          Tentar novamente
        </button>
      </div>
      <div v-if="mensagemSucesso" class="alert alert-success" role="status">
        {{ mensagemSucesso }}
        <RouterLink class="alert-link ms-1" to="/carrinho">
          Ver carrinho
        </RouterLink>
      </div>

      <div v-if="carregando" class="catalog-message" role="status">
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        Carregando Funkos...
      </div>
      <div v-else-if="!mensagemErro && funkosFiltrados.length === 0" class="catalog-message empty-state">
        <i class="bi bi-search" aria-hidden="true"></i>
        <h3>Nenhum Funko encontrado</h3>
        <p>Experimente mudar a busca ou o filtro de categoria.</p>
      </div>
      <div v-else-if="!mensagemErro" class="product-grid">
        <article v-for="funko in funkosFiltrados" :key="funko.id" class="product-card">
          <RouterLink
            class="product-image"
            :to="{ name: 'detalhesFunkos', params: { id: funko.id } }"
            :aria-label="`Ver detalhes de ${funko.nome}`"
          >
            <span class="product-category">{{ nomeCategoria(funko.categoriaId) }}</span>
            <span class="image-placeholder" aria-hidden="true">
              <i class="bi bi-box-seam"></i>
            </span>
            <img
              v-if="funko.imagem"
              :src="funko.imagem"
              :alt="funko.nome"
              loading="lazy"
              @error="imagemIndisponivel"
            />
          </RouterLink>

          <div class="product-info">
            <p class="product-character">{{ funko.personagem || 'Funko Pop' }}</p>
            <h3>{{ funko.nome }}</h3>
            <p class="product-description">{{ funko.descricao }}</p>
            <p class="product-stock">
              <i class="bi bi-box-seam" aria-hidden="true"></i>
              {{ Number(funko.estoque) > 0 ? `${funko.estoque} em estoque` : 'Indisponível' }}
            </p>
            <div class="product-footer">
              <strong>{{ formatarPreco(funko.preco) }}</strong>
              <button
                class="btn btn-sm btn-add-cart"
                type="button"
                :disabled="Number(funko.estoque) < 1 || adicionandoId === funko.id"
                :aria-label="`Adicionar ${funko.nome} ao carrinho`"
                @click="adicionarFunko(funko)"
              >
                <i class="bi bi-cart-plus" aria-hidden="true"></i>
                {{ adicionandoId === funko.id ? 'Adicionando...' : 'Adicionar' }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.storefront {
  min-height: 100vh;
  background: #fffaf7;
  color: #292332;
}

.storefront-hero {
  overflow: hidden;
  background: linear-gradient(115deg, #fff0e8 0%, #fff8f1 62%, #ffe1d3 100%);
}

.hero-content {
  display: flex;
  min-height: 310px;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.hero-eyebrow,
.section-eyebrow {
  color: #bf5845;
  font-size: 0.77rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.hero-content h1 {
  max-width: 590px;
  margin: 0.65rem 0;
  font-size: clamp(2.35rem, 5vw, 4rem);
  font-weight: 850;
  letter-spacing: -0.055em;
  line-height: 1.05;
}

.hero-content h1 span {
  color: #d65b47;
}

.hero-content p {
  margin-bottom: 1.4rem;
  color: #655b5a;
  font-size: 1.08rem;
}

.hero-button,
.btn-add-cart {
  border: 0;
  border-radius: 0.75rem;
  background: #d65b47;
  color: white;
  font-weight: 700;
}

.hero-button {
  padding: 0.75rem 1rem;
}

.hero-button:hover,
.btn-add-cart:hover:not(:disabled) {
  background: #b94535;
  color: white;
}

.hero-art {
  position: relative;
  display: grid;
  width: 230px;
  height: 190px;
  flex: 0 0 auto;
  place-items: center;
  margin-right: 4rem;
  border: 2px solid #f1b3a0;
  border-radius: 48% 52% 56% 44%;
  background: #ffd9ca;
  color: #c94d3b;
  transform: rotate(-8deg);
}

.hero-art span {
  font-size: 3.8rem;
  font-weight: 950;
  letter-spacing: -0.1em;
  text-shadow: 3px 4px 0 #fff8f1;
}

.hero-art .bi-stars {
  position: absolute;
  top: 1.1rem;
  right: 1.2rem;
  font-size: 2rem;
}

.hero-art .bi-heart-fill {
  position: absolute;
  bottom: 1.3rem;
  left: 1.4rem;
  font-size: 1.5rem;
}

.catalog-section {
  padding-top: 3.25rem;
  padding-bottom: 4rem;
}

.catalog-heading,
.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.catalog-heading h2 {
  margin: 0.35rem 0 0;
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.product-count {
  border-radius: 999px;
  background: #f7e9e3;
  color: #9c4a3b;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.45rem 0.85rem;
}

.catalog-filters {
  display: flex;
  gap: 0.8rem;
  margin: 1.5rem 0 1.75rem;
}

.search-field,
.category-field {
  display: flex;
  min-height: 48px;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid #eadfd9;
  border-radius: 0.75rem;
  background: white;
  color: #887b78;
  padding: 0 0.9rem;
}

.search-field {
  flex: 1;
}

.search-field input,
.category-field select {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #292332;
}

.category-field {
  width: min(260px, 36%);
}

.catalog-message {
  display: flex;
  min-height: 230px;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #655b5a;
}

.empty-state {
  flex-direction: column;
  text-align: center;
}

.empty-state > i {
  color: #d65b47;
  font-size: 2.5rem;
}

.empty-state h3 {
  margin: 0;
  color: #292332;
  font-size: 1.25rem;
  font-weight: 750;
}

.empty-state p {
  margin: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
  gap: 1.2rem;
}

.product-card {
  overflow: hidden;
  border: 1px solid #f0e5df;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 7px 22px rgb(61 34 25 / 5%);
  transition: box-shadow 180ms ease, transform 180ms ease;
}

.product-card:hover {
  box-shadow: 0 13px 30px rgb(61 34 25 / 10%);
  transform: translateY(-3px);
}

.product-image {
  position: relative;
  display: grid;
  height: 218px;
  place-items: center;
  overflow: hidden;
  background: radial-gradient(circle at 50% 40%, #fff 0%, #fff3ec 70%);
}

.product-image img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1rem;
}

.image-placeholder {
  color: #e8c9bc;
  font-size: 4rem;
}

.product-category {
  position: absolute;
  z-index: 1;
  top: 0.8rem;
  left: 0.8rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 92%);
  color: #9c4a3b;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.3rem 0.65rem;
}

.product-info {
  padding: 1rem;
}

.product-character {
  margin: 0 0 0.2rem;
  color: #bc5947;
  font-size: 0.78rem;
  font-weight: 750;
  text-transform: uppercase;
}

.product-info h3 {
  overflow: hidden;
  margin: 0;
  font-size: 1.05rem;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-description {
  display: -webkit-box;
  min-height: 2.6rem;
  overflow: hidden;
  margin: 0.45rem 0 0.7rem;
  color: #746b69;
  font-size: 0.88rem;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-stock {
  margin-bottom: 0.9rem;
  color: #746b69;
  font-size: 0.8rem;
}

.product-footer strong {
  font-size: 1.05rem;
}

.btn-add-cart:disabled {
  background: #b7aaa6;
  color: white;
}

@media (max-width: 575px) {
  .hero-content {
    min-height: 270px;
  }

  .hero-art {
    display: none;
  }

  .catalog-filters {
    flex-direction: column;
  }

  .category-field {
    width: 100%;
  }

  .product-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
