<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
  atualizarCategoria,
  criarCategoria,
  excluirCategoria,
  listarCategorias,
  listarProdutosPorCategoria,
} from '@/services/categorias';

const categorias = ref([]);
const formulario = ref({ nome: '', descricao: '' });
const categoriaEditando = ref(null);
const carregando = ref(true);
const salvando = ref(false);
const erro = ref('');
const sucesso = ref('');

async function carregarCategorias() {
  erro.value = '';
  carregando.value = true;

  try {
    categorias.value = await listarCategorias();
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    erro.value = error.message || 'Não foi possível carregar as categorias.';
  } finally {
    carregando.value = false;
  }
}

function editarCategoria(categoria) {
  categoriaEditando.value = categoria.id;
  formulario.value = {
    nome: categoria.nome,
    descricao: categoria.descricao || '',
  };
  erro.value = '';
  sucesso.value = '';
}

function limparFormulario() {
  categoriaEditando.value = null;
  formulario.value = { nome: '', descricao: '' };
}

async function salvarCategoria() {
  const nome = formulario.value.nome.trim();
  const descricao = formulario.value.descricao.trim();

  erro.value = '';
  sucesso.value = '';

  if (!nome) {
    erro.value = 'Informe o nome da categoria.';
    return;
  }

  const nomeDuplicado = categorias.value.some(
    (categoria) =>
      String(categoria.id) !== String(categoriaEditando.value) &&
      categoria.nome.trim().toLocaleLowerCase('pt-BR') ===
        nome.toLocaleLowerCase('pt-BR'),
  );

  if (nomeDuplicado) {
    erro.value = 'Já existe uma categoria com esse nome.';
    return;
  }

  salvando.value = true;

  try {
    const categoria = { nome, descricao };

    if (categoriaEditando.value === null) {
      await criarCategoria(categoria);
      sucesso.value = 'Categoria cadastrada com sucesso.';
    } else {
      await atualizarCategoria(categoriaEditando.value, categoria);
      sucesso.value = 'Categoria atualizada com sucesso.';
    }

    limparFormulario();
    await carregarCategorias();
  } catch (error) {
    console.error('Erro ao salvar categoria:', error);
    erro.value = error.message || 'Não foi possível salvar a categoria.';
  } finally {
    salvando.value = false;
  }
}

async function removerCategoria(categoria) {
  erro.value = '';
  sucesso.value = '';

  if (!window.confirm(`Deseja excluir a categoria "${categoria.nome}"?`)) {
    return;
  }

  try {
    const produtos = await listarProdutosPorCategoria(categoria.id);

    if (produtos.length > 0) {
      erro.value = `A categoria "${categoria.nome}" está vinculada a ${produtos.length} Funko(s). Altere a categoria desses produtos antes de excluí-la.`;
      return;
    }

    await excluirCategoria(categoria.id);
    categorias.value = categorias.value.filter(
      (item) => String(item.id) !== String(categoria.id),
    );
    sucesso.value = 'Categoria excluída com sucesso.';

    if (String(categoriaEditando.value) === String(categoria.id)) {
      limparFormulario();
    }
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    erro.value = error.message || 'Não foi possível excluir a categoria.';
  }
}

onMounted(carregarCategorias);
</script>

<template>
  <main class="container py-5">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <h1 class="h2 fw-bold mb-1">Categorias de Funko Pop</h1>
        <p class="text-body-secondary mb-0">
          Organize os Funkos por franquia ou universo.
        </p>
      </div>
      <RouterLink class="btn btn-outline-secondary" to="/">
        Voltar ao início
      </RouterLink>
    </div>

    <div v-if="erro" class="alert alert-danger" role="alert">
      {{ erro }}
    </div>
    <div v-if="sucesso" class="alert alert-success" role="status">
      {{ sucesso }}
    </div>

    <section class="card border-0 shadow-sm mb-5" aria-labelledby="form-titulo">
      <div class="card-body p-4">
        <h2 id="form-titulo" class="h4 mb-3">
          {{ categoriaEditando === null ? 'Nova categoria' : 'Editar categoria' }}
        </h2>

        <form class="row g-3" @submit.prevent="salvarCategoria">
          <div class="col-md-5">
            <label for="nome-categoria" class="form-label">Nome</label>
            <input
              id="nome-categoria"
              v-model="formulario.nome"
              class="form-control"
              type="text"
              maxlength="80"
              placeholder="Ex.: Marvel"
              required
            />
          </div>

          <div class="col-md-7">
            <label for="descricao-categoria" class="form-label">
              Descrição <span class="text-body-secondary">(opcional)</span>
            </label>
            <input
              id="descricao-categoria"
              v-model="formulario.descricao"
              class="form-control"
              type="text"
              maxlength="200"
              placeholder="Ex.: Heróis e personagens da Marvel"
            />
          </div>

          <div class="col-12 d-flex gap-2">
            <button class="btn btn-primary" type="submit" :disabled="salvando">
              {{ salvando ? 'Salvando...' : categoriaEditando === null ? 'Cadastrar categoria' : 'Salvar alterações' }}
            </button>
            <button
              v-if="categoriaEditando !== null"
              class="btn btn-outline-secondary"
              type="button"
              @click="limparFormulario"
            >
              Cancelar edição
            </button>
          </div>
        </form>
      </div>
    </section>

    <section aria-labelledby="lista-titulo">
      <h2 id="lista-titulo" class="h4 mb-3">Categorias cadastradas</h2>

      <div v-if="carregando" class="text-body-secondary" role="status">
        Carregando categorias...
      </div>
      <div v-else-if="categorias.length === 0" class="alert alert-info">
        Nenhuma categoria cadastrada. Use o formulário acima para criar a primeira.
      </div>

      <div v-else class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nome</th>
              <th scope="col">Descrição</th>
              <th scope="col" class="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="categoria in categorias" :key="categoria.id">
              <td>{{ categoria.id }}</td>
              <td class="fw-semibold">{{ categoria.nome }}</td>
              <td>{{ categoria.descricao || '—' }}</td>
              <td class="text-end">
                <div class="d-inline-flex gap-2">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    type="button"
                    :aria-label="`Editar categoria ${categoria.nome}`"
                    @click="editarCategoria(categoria)"
                  >
                    Editar
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    type="button"
                    :aria-label="`Excluir categoria ${categoria.nome}`"
                    @click="removerCategoria(categoria)"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
