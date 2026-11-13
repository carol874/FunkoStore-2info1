<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { listarCategorias } from '@/services/categorias';
import { atualizarFunko, excluirFunko, listarFunkos } from '@/services/funkos';

const funkos = ref([]);
const categorias = ref([]);
const carregando = ref(true);
const mensagemErro = ref('');
const busca = ref('');
const categoriaSelecionada = ref('');
const funkoEmEdicao = ref(null);
const salvando = ref(false);
const excluindoId = ref(null);

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
  return categorias.value.find((categoria) => String(categoria.id) === String(id))
    ?.nome || 'Sem categoria';
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

function editarFunko(funko) {
  funkoEmEdicao.value = {
    id: funko.id,
    nome: funko.nome || '',
    personagem: funko.personagem || '',
    descricao: funko.descricao || '',
    anoLancamento: funko.anoLancamento || '',
    preco: funko.preco ?? '',
    imagem: funko.imagem || '',
    estoque: funko.estoque ?? 0,
    categoriaId: funko.categoriaId ?? '',
  };
}

function fecharEdicao() {
  if (!salvando.value) {
    funkoEmEdicao.value = null;
  }
}

async function salvarEdicao() {
  if (!funkoEmEdicao.value) return;

  salvando.value = true;
  mensagemErro.value = '';

  try {
    const alteracoes = {
      ...funkoEmEdicao.value,
      anoLancamento: Number(funkoEmEdicao.value.anoLancamento),
      preco: Number(funkoEmEdicao.value.preco),
      estoque: Number(funkoEmEdicao.value.estoque),
      categoriaId: Number(funkoEmEdicao.value.categoriaId),
    };

    delete alteracoes.id;
    await atualizarFunko(funkoEmEdicao.value.id, alteracoes);
    funkoEmEdicao.value = null;
    await carregarDados();
  } catch (erro) {
    console.error('Erro ao atualizar Funko:', erro);
    mensagemErro.value = erro.message || 'Não foi possível atualizar o Funko.';
  } finally {
    salvando.value = false;
  }
}

async function removerFunko(funko) {
  if (!window.confirm(`Deseja excluir "${funko.nome}"? Esta ação não pode ser desfeita.`)) {
    return;
  }

  excluindoId.value = funko.id;
  mensagemErro.value = '';

  try {
    await excluirFunko(funko.id);
    funkos.value = funkos.value.filter((item) => item.id !== funko.id);
  } catch (erro) {
    console.error('Erro ao excluir Funko:', erro);
    mensagemErro.value = erro.message || 'Não foi possível excluir o Funko.';
  } finally {
    excluindoId.value = null;
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
          {{ funkosFiltrados.length }} {{ funkosFiltrados.length === 1 ? 'produto' : 'produtos' }}
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
          <span class="visually-hidden">Filtrar por categoria</span>
          <i class="bi bi-filter" aria-hidden="true"></i>
          <select v-model="categoriaSelecionada">
            <option value="">Todas as categorias</option>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
              {{ categoria.nome }}
            </option>
          </select>
        </label>
      </div>

      <div v-if="mensagemErro" class="alert alert-danger d-flex align-items-center gap-2" role="alert">
        <i class="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
        <span>{{ mensagemErro }}</span>
        <button class="btn btn-sm btn-outline-danger ms-auto" type="button" @click="carregarDados">
          Tentar novamente
        </button>
      </div>

      <div v-if="carregando" class="catalog-message" role="status">
        <span class="spinner-border text-primary" aria-hidden="true"></span>
        <span>Carregando coleção...</span>
      </div>

      <div v-else-if="!mensagemErro && funkos.length === 0" class="catalog-message empty-state">
        <i class="bi bi-box-seam" aria-hidden="true"></i>
        <h3>A coleção ainda está vazia</h3>
        <p>Cadastre o primeiro Funko para começar.</p>
        <RouterLink class="btn btn-primary" :to="{ name: 'addFunkos' }">
          Cadastrar primeiro Funko
        </RouterLink>
      </div>

      <div
        v-else-if="!mensagemErro && funkosFiltrados.length === 0"
        class="catalog-message empty-state"
      >
        <i class="bi bi-search" aria-hidden="true"></i>
        <h3>Nenhum Funko encontrado</h3>
        <p>Tente outro termo ou escolha uma categoria diferente.</p>
        <button
          class="btn btn-outline-primary"
          type="button"
          @click="busca = ''; categoriaSelecionada = ''"
        >
          Limpar filtros
        </button>
      </div>

      <div v-else-if="!mensagemErro" class="product-grid">
        <article v-for="funko in funkosFiltrados" :key="funko.id" class="product-card">
          <div class="product-image">
            <span class="product-category">{{ nomeCategoria(funko.categoriaId) }}</span>
            <i class="bi bi-box-heart image-placeholder" aria-hidden="true"></i>
            <img
              v-if="funko.imagem"
              :src="funko.imagem"
              :alt="`Funko ${funko.personagem || funko.nome}`"
              loading="lazy"
              @error="imagemIndisponivel"
            />
          </div>
          <div class="product-info">
            <p class="product-character">{{ funko.personagem || 'Funko Pop!' }}</p>
            <h3>{{ funko.nome }}</h3>
            <p class="product-description">{{ funko.descricao || 'Item especial para sua coleção.' }}</p>
            <div class="product-meta">
              <span>{{ funko.estoque > 0 ? `${funko.estoque} em estoque` : 'Fora de estoque' }}</span>
              <span v-if="funko.anoLancamento">{{ funko.anoLancamento }}</span>
            </div>
            <div class="product-footer">
              <strong>{{ formatarPreco(funko.preco) }}</strong>
              <div class="product-actions">
                <button
                  class="icon-button"
                  type="button"
                  :aria-label="`Editar ${funko.nome}`"
                  title="Editar"
                  @click="editarFunko(funko)"
                >
                  <i class="bi bi-pencil" aria-hidden="true"></i>
                </button>
                <button
                  class="icon-button delete-button"
                  type="button"
                  :aria-label="`Excluir ${funko.nome}`"
                  title="Excluir"
                  :disabled="excluindoId === funko.id"
                  @click="removerFunko(funko)"
                >
                  <span
                    v-if="excluindoId === funko.id"
                    class="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                  <i v-else class="bi bi-trash3" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <div
      v-if="funkoEmEdicao"
      class="edit-backdrop"
      @click.self="fecharEdicao"
      @keydown.esc="fecharEdicao"
    >
      <section
        class="edit-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
        tabindex="-1"
      >
        <div class="edit-heading">
          <div>
            <span class="section-eyebrow">Atualize sua coleção</span>
            <h2 id="edit-title">Editar Funko</h2>
          </div>
          <button
            class="icon-button"
            type="button"
            aria-label="Fechar edição"
            :disabled="salvando"
            @click="fecharEdicao"
          >
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
        <form class="edit-form" @submit.prevent="salvarEdicao">
          <label>
            Nome do Funko
            <input v-model.trim="funkoEmEdicao.nome" class="form-control" required />
          </label>
          <label>
            Personagem
            <input v-model.trim="funkoEmEdicao.personagem" class="form-control" required />
          </label>
          <label>
            Descrição
            <textarea v-model.trim="funkoEmEdicao.descricao" class="form-control" rows="2"></textarea>
          </label>
          <div class="edit-fields-row">
            <label>
              Ano de lançamento
              <input
                v-model="funkoEmEdicao.anoLancamento"
                class="form-control"
                type="number"
                min="1900"
                required
              />
            </label>
            <label>
              Preço (R$)
              <input
                v-model="funkoEmEdicao.preco"
                class="form-control"
                type="number"
                min="0"
                step="0.01"
                required
              />
            </label>
          </div>
          <div class="edit-fields-row">
            <label>
              Estoque
              <input
                v-model="funkoEmEdicao.estoque"
                class="form-control"
                type="number"
                min="0"
                required
              />
            </label>
            <label>
              Categoria
              <select v-model="funkoEmEdicao.categoriaId" class="form-select" required>
                <option value="" disabled>Selecione</option>
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                  {{ categoria.nome }}
                </option>
              </select>
            </label>
          </div>
          <label>
            URL da imagem
            <input v-model.trim="funkoEmEdicao.imagem" class="form-control" type="url" />
          </label>
          <div class="edit-actions">
            <button class="btn btn-outline-secondary" type="button" :disabled="salvando" @click="fecharEdicao">
              Cancelar
            </button>
            <button class="btn btn-primary" type="submit" :disabled="salvando">
              <span
                v-if="salvando"
                class="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
              {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
            </button>
          </div>
        </form>
      </section>
    </div>
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
  background: linear-gradient(115deg, #fff0e8 0%, #fff8f1 55%, #ffe1d1 100%);
}

.hero-content {
  position: relative;
  display: flex;
  min-height: 320px;
  align-items: center;
  justify-content: space-between;
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

.hero-button {
  border: 0;
  border-radius: 0.75rem;
  background: #d65b47;
  color: white;
  font-weight: 700;
  padding: 0.75rem 1rem;
}

.hero-button:hover {
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
.product-footer,
.edit-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.catalog-heading h2,
.edit-heading h2 {
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
  color: #756c69;
  font-size: 0.86rem;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f1e9e5;
  color: #857b77;
  font-size: 0.78rem;
  padding-bottom: 0.75rem;
}

.product-footer {
  gap: 0.6rem;
  padding-top: 0.75rem;
}

.product-footer strong {
  color: #292332;
  font-size: 1.1rem;
}

.product-actions {
  display: flex;
  gap: 0.35rem;
}

.icon-button {
  display: inline-grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid #eadfd9;
  border-radius: 0.65rem;
  background: white;
  color: #655b5a;
}

.icon-button:hover:not(:disabled) {
  border-color: #d65b47;
  color: #c94d3b;
}

.icon-button:disabled {
  opacity: 0.65;
}

.delete-button:hover:not(:disabled) {
  border-color: #dc3545;
  color: #dc3545;
}

.edit-backdrop {
  position: fixed;
  z-index: 1050;
  inset: 0;
  display: grid;
  overflow-y: auto;
  place-items: center;
  background: rgb(33 27 31 / 55%);
  padding: 1rem;
}

.edit-dialog {
  width: min(100%, 590px);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 24px 70px rgb(0 0 0 / 20%);
  padding: 1.5rem;
}

.edit-heading {
  margin-bottom: 1.2rem;
}

.edit-heading h2 {
  font-size: 1.5rem;
}

.edit-form {
  display: grid;
  gap: 0.9rem;
}

.edit-form label {
  display: grid;
  gap: 0.35rem;
  color: #514846;
  font-size: 0.88rem;
  font-weight: 650;
}

.edit-fields-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.4rem;
}

@media (max-width: 640px) {
  .hero-content {
    min-height: 285px;
  }

  .hero-art {
    position: absolute;
    right: -5.2rem;
    bottom: -3.2rem;
    width: 175px;
    height: 150px;
    opacity: 0.52;
  }

  .hero-content > div:first-child {
    position: relative;
    z-index: 1;
  }

  .hero-content h1 {
    max-width: 420px;
  }

  .catalog-section {
    padding-top: 2.3rem;
  }

  .catalog-filters {
    flex-direction: column;
  }

  .category-field {
    width: 100%;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
  }

  .product-image {
    height: 170px;
  }

  .product-info {
    padding: 0.75rem;
  }

  .product-footer strong {
    font-size: 0.95rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card {
    transition: none;
  }
}
</style>
