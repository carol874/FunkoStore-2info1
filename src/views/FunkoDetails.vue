
<script setup>
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { API_URL } from '@/services/categorias';
import {
  atualizarComentario,
  criarComentario,
  excluirComentario,
  listarComentarios,
  verificarCompra,
} from '@/services/comentarios';

const route = useRoute();

const produto = ref(null);
const comentarios = ref([]);
const carregando = ref(true);
const erro = ref('');

const email = ref('');
const usuarioAtual = ref(null);
const verificando = ref(false);
const mensagemAcesso = ref('');

const textoComentario = ref('');
const comentarioEditando = ref(null);
const salvando = ref(false);
const mensagemComentario = ref('');

async function carregarDados() {
  carregando.value = true;
  erro.value = '';
  usuarioAtual.value = null;

  try {
    const resposta = await fetch(`${API_URL}/produtos/${route.params.id}`);

    if (!resposta.ok) {
      throw new Error('Funko não encontrado.');
    }

    produto.value = await resposta.json();
    comentarios.value = await listarComentarios(route.params.id);
  } catch (erroCarregamento) {
    erro.value = erroCarregamento.message;
  } finally {
    carregando.value = false;
  }
}

async function conferirCompra() {
  mensagemAcesso.value = '';
  usuarioAtual.value = null;
  verificando.value = true;

  try {
    if (!email.value.trim()) {
      mensagemAcesso.value = 'Informe seu e-mail.';
      return;
    }

    const usuario = await verificarCompra(email.value, route.params.id);

    if (!usuario) {
      mensagemAcesso.value = 'Não encontramos uma compra deste Funko para este cadastro.';
      return;
    }

    usuarioAtual.value = usuario;

    const existente = comentarios.value.find(
      item => String(item.usuarioId) === String(usuario.id)
    );

    if (existente) {
      comentarioEditando.value = existente.id;
      textoComentario.value = existente.texto;
      mensagemAcesso.value = 'Você já comentou. Pode editar seu comentário.';
    } else {
      comentarioEditando.value = null;
      textoComentario.value = '';
      mensagemAcesso.value = `Compra confirmada! Olá, ${usuario.nome}.`;
    }
  } catch (erroVerificacao) {
    mensagemAcesso.value = erroVerificacao.message;
  } finally {
    verificando.value = false;
  }
}

async function salvarComentario() {
  mensagemComentario.value = '';

  if (!usuarioAtual.value) {
    mensagemComentario.value = 'Verifique sua compra primeiro.';
    return;
  }

  if (!textoComentario.value.trim()) {
    mensagemComentario.value = 'Escreva um comentário.';
    return;
  }

  if (textoComentario.value.length > 300) {
    mensagemComentario.value = 'O comentário pode ter no máximo 300 caracteres.';
    return;
  }

  salvando.value = true;

  try {
    if (comentarioEditando.value) {
      await atualizarComentario(
        comentarioEditando.value,
        usuarioAtual.value,
        textoComentario.value
      );
    } else {
      await criarComentario(
        usuarioAtual.value,
        route.params.id,
        textoComentario.value
      );
    }

    comentarios.value = await listarComentarios(route.params.id);

    const salvo = comentarios.value.find(
      item => String(item.usuarioId) === String(usuarioAtual.value.id)
    );

    comentarioEditando.value = salvo?.id || null;
    textoComentario.value = salvo?.texto || '';
    mensagemComentario.value = 'Comentário salvo com sucesso!';
  } catch (erroSalvar) {
    mensagemComentario.value = erroSalvar.message;
  } finally {
    salvando.value = false;
  }
}

function editarComentario(comentario) {
  comentarioEditando.value = comentario.id;
  textoComentario.value = comentario.texto;
  mensagemComentario.value = '';
}

async function removerComentario(comentario) {
  if (!window.confirm('Deseja excluir seu comentário?')) return;

  try {
    await excluirComentario(comentario.id, usuarioAtual.value);

    comentarios.value = await listarComentarios(route.params.id);
    comentarioEditando.value = null;
    textoComentario.value = '';
    mensagemComentario.value = 'Comentário excluído.';
  } catch (erroExcluir) {
    mensagemComentario.value = erroExcluir.message;
  }
}

function formatarPreco(preco) {
  return Number(preco || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatarData(data) {
  const dataComentario = new Date(data);

  if (Number.isNaN(dataComentario.getTime())) return '';

  return dataComentario.toLocaleDateString('pt-BR');
}

watch(() => route.params.id, carregarDados, { immediate: true });
</script>

<template>
  <main class="container py-5">

    <div v-if="carregando" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
      <p class="mt-3">Carregando Funko...</p>
    </div>

    <div v-else-if="erro" class="alert alert-danger">
      {{ erro }}
      <div class="mt-3">
        <RouterLink to="/" class="btn btn-outline-danger">
          Voltar para a loja
        </RouterLink>
      </div>
    </div>

    <div v-else-if="produto">

      <RouterLink to="/" class="btn btn-link text-decoration-none px-0 mb-3">
        <i class="bi bi-arrow-left me-1"></i>
        Voltar para a loja
      </RouterLink>

      <div class="row g-4 align-items-center mb-5">

        <div class="col-md-5">
          <div class="produto-imagem rounded-4 p-4 text-center">
            <img
              v-if="produto.imagem"
              :src="produto.imagem"
              :alt="produto.nome"
              class="img-fluid"
            />
            <i v-else class="bi bi-box-seam display-1"></i>
          </div>
        </div>

        <div class="col-md-7">
          <span class="text-danger fw-bold">FUNKO POP</span>

          <h1 class="fw-bold mt-2">{{ produto.nome }}</h1>

          <p v-if="produto.personagem" class="text-muted">
            Personagem: {{ produto.personagem }}
          </p>

          <p>{{ produto.descricao }}</p>

          <h2 class="text-danger mt-4">
            {{ formatarPreco(produto.preco) }}
          </h2>

          <p class="text-muted">
            {{ produto.estoque }} unidades disponíveis
          </p>
        </div>

      </div>

      <section v-if="produto.informacoes || produto.detalhes" class="mb-5">
        <div v-if="produto.informacoes" class="mb-4">
          <h2 class="h4">Sobre o produto</h2>
          <p>{{ produto.informacoes }}</p>
        </div>

        <div v-if="produto.detalhes">
          <h2 class="h4">Detalhes do colecionável</h2>
          <p>{{ produto.detalhes }}</p>
        </div>
      </section>

      <section class="comentarios-area">

        <div class="mb-4">
          <h2 class="h3 fw-bold">Comentários</h2>
          <p class="text-muted">
            Somente clientes cadastrados que compraram este Funko podem comentar.
          </p>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">

            <h3 class="h5 mb-3">Verificar minha compra</h3>

            <form class="row g-2" @submit.prevent="conferirCompra">

              <div class="col-md-8">
                <label for="email-comentario" class="form-label">
                  E-mail do cadastro
                </label>

                <input
                  id="email-comentario"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="seuemail@email.com"
                  required
                />
              </div>

              <div class="col-md-4 d-flex align-items-end">
                <button
                  class="btn btn-danger w-100"
                  type="submit"
                  :disabled="verificando"
                >
                  {{ verificando ? 'Verificando...' : 'Verificar compra' }}
                </button>
              </div>

            </form>

            <p v-if="mensagemAcesso" class="mt-3 mb-0">
              {{ mensagemAcesso }}
            </p>

          </div>
        </div>

        <div v-if="usuarioAtual" class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">

            <h3 class="h5">
              {{ comentarioEditando ? 'Editar comentário' : 'Escrever comentário' }}
            </h3>

            <form @submit.prevent="salvarComentario">

              <textarea
                v-model="textoComentario"
                class="form-control"
                rows="4"
                maxlength="300"
                placeholder="Conte o que achou deste Funko..."
              ></textarea>

              <div class="d-flex justify-content-between align-items-center mt-2">
                <small class="text-muted">
                  {{ textoComentario.length }}/300 caracteres
                </small>

                <div class="d-flex gap-2">

                  <button
                    v-if="comentarioEditando"
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="comentarioEditando = null; textoComentario = ''"
                  >
                    Cancelar
                  </button>

                  <button
                    class="btn btn-danger"
                    type="submit"
                    :disabled="salvando"
                  >
                    {{ salvando ? 'Salvando...' : comentarioEditando ? 'Atualizar' : 'Publicar' }}
                  </button>

                </div>
              </div>

            </form>

            <p v-if="mensagemComentario" class="mt-3 mb-0">
              {{ mensagemComentario }}
            </p>

          </div>
        </div>

        <p v-if="comentarios.length === 0" class="text-muted">
          Ainda não há comentários para este Funko.
        </p>

        <article
          v-for="comentario in comentarios"
          :key="comentario.id"
          class="card border-0 shadow-sm mb-3"
        >
          <div class="card-body p-4">

            <div class="d-flex justify-content-between flex-wrap gap-2 mb-2">
              <strong>{{ comentario.usuarioNome }}</strong>
              <small class="text-muted">
                {{ formatarData(comentario.dataAtualizacao || comentario.dataCriacao) }}
              </small>
            </div>

            <p class="mb-3" style="white-space: pre-wrap">
              {{ comentario.texto }}
            </p>

            <div
              v-if="usuarioAtual && String(comentario.usuarioId) === String(usuarioAtual.id)"
              class="d-flex gap-2"
            >
              <button
                class="btn btn-sm btn-outline-primary"
                type="button"
                @click="editarComentario(comentario)"
              >
                <i class="bi bi-pencil me-1"></i>
                Editar
              </button>

              <button
                class="btn btn-sm btn-outline-danger"
                type="button"
                @click="removerComentario(comentario)"
              >
                <i class="bi bi-trash me-1"></i>
                Excluir
              </button>
            </div>

          </div>
        </article>

      </section>
    </div>
  </main>
</template>

<style scoped>
.produto-imagem {
  min-height: 300px;
  background: #fff3ec;
}

.produto-imagem img {
  max-height: 380px;
  object-fit: contain;
}

.comentarios-area {
  max-width: 900px;
  margin: 0 auto;
}
</style>
