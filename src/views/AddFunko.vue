<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();

const API_URL = import.meta.env.DEV
  ? 'http://localhost:3000'
  : 'SUA_URL_DA_API';

// Objeto reativo para o formulário
const novoFunko = ref({
  nome: '',
  personagem: '',
  descricao: '',
  informacoes: '',
  detalhes: '',
  anoLancamento: '',
  preco: '',
  imagem: '',
  estoque: '',
  vendas: 0, // Valor inicial padrão
  Avaliações: '',
  categoriaId: '',
});

const mensagemErro = ref('');
const salvando = ref(false);

async function salvarFunko() {
  mensagemErro.value = '';
  salvando.value = true;

  try {
    const produtoPayload = {
      ...novoFunko.value,
      anoLancamento: Number(novoFunko.value.anoLancamento),
      preco: Number(novoFunko.value.preco),
      estoque: Number(novoFunko.value.estoque),
      vendas: Number(novoFunko.value.vendas),
      categoriaId: Number(novoFunko.value.categoriaId),
      Avaliações: Number(novoFunko.value.Avaliações),
    };

    const resposta = await fetch(`${API_URL}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produtoPayload),
    });

    if (!resposta.ok) {
      throw new Error('Não foi possível cadastrar o produto. Verifique os dados.');
    }

    // Redireciona para a listagem após o sucesso
    router.push({ name: 'produtos' });

  } catch (erro) {
    console.error('Erro ao salvar:', erro);
    mensagemErro.value = erro.message || 'Ocorreu um erro ao conectar com o servidor.';
  } finally {
    salvando.value = false;
  }
}
</script>

<template>
  <div class="container py-4">
    <header class="mb-4">
      <h1 class="h2 fw-bold">Adicionar Funko</h1>
      <p class="text-body-secondary">
        Preencha as informações abaixo para cadastrar um novo produto colecionável.
      </p>
    </header>

    <RouterLink
      class="btn btn-outline-primary mb-4"
      :to="{ name: 'produtos' }"
    >
      ← Voltar para produtos
    </RouterLink>

    <!-- Mensagem de erro global -->
    <div v-if="mensagemErro" class="alert alert-danger" role="alert">
      {{ mensagemErro }}
    </div>

    <form class="row g-3" @submit.prevent="salvarFunko">

      <!-- Identificação -->
      <div class="col-12">
        <h2 class="h5 border-bottom pb-2">Identificação do produto</h2>
      </div>

      <div class="col-md-7">
        <label for="nome" class="form-label">Nome do Funko</label>
        <input
          id="nome"
          type="text"
          class="form-control"
          v-model="novoFunko.nome"
          placeholder="Ex: Spider-Man Funko Pop"
          required
        />
      </div>

      <div class="col-md-5">
        <label for="personagem" class="form-label">Personagem</label>
        <input
          id="personagem"
          type="text"
          class="form-control"
          v-model="novoFunko.personagem"
          placeholder="Ex: Homem-Aranha"
          required
        />
      </div>

      <div class="col-md-4">
        <label for="anoLancamento" class="form-label">Ano de lançamento</label>
        <input
          id="anoLancamento"
          type="number"
          class="form-control"
          v-model="novoFunko.anoLancamento"
          min="1900"
          max="2030"
          required
        />
      </div>

      <div class="col-md-4">
        <label for="categoriaId" class="form-label">ID da categoria</label>
        <input
          id="categoriaId"
          type="number"
          class="form-control"
          v-model="novoFunko.categoriaId"
          min="1"
          required
        />
      </div>

      <div class="col-md-4">
        <label for="preco" class="form-label">Preço (R$)</label>
        <input
          id="preco"
          type="number"
          class="form-control"
          v-model="novoFunko.preco"
          min="0"
          step="0.01"
          placeholder="0.00"
          required
        />
      </div>

      <!-- Descrições -->
      <div class="col-12 mt-4">
        <h2 class="h5 border-bottom pb-2">Descrições do produto</h2>
      </div>

      <div class="col-12">
        <label for="descricao" class="form-label">Descrição Resumida</label>
        <textarea
          id="descricao"
          class="form-control"
          rows="2"
          v-model="novoFunko.descricao"
          placeholder="Descrição resumida do produto..."
          required
        ></textarea>
      </div>

      <div class="col-12">
        <label for="informacoes" class="form-label">Informações / História</label>
        <textarea
          id="informacoes"
          class="form-control"
          rows="4"
          v-model="novoFunko.informacoes"
          placeholder="Apresente o personagem e sua história..."
          required
        ></textarea>
      </div>

      <div class="col-12">
        <label for="detalhes" class="form-label">Detalhes do Colecionável</label>
        <textarea
          id="detalhes"
          class="form-control"
          rows="4"
          v-model="novoFunko.detalhes"
          placeholder="Descreva a aparência e características do colecionável..."
          required
        ></textarea>
      </div>

      <!-- Imagem -->
      <div class="col-12 mt-4">
        <h2 class="h5 border-bottom pb-2">Imagem do produto</h2>
      </div>

      <div class="col-12">
        <label for="imagem" class="form-label">URL da imagem</label>
        <input
          id="imagem"
          type="url"
          class="form-control"
          v-model="novoFunko.imagem"
          placeholder="https://exemplo.com/imagem.jpg"
          required
        />
      </div>

      <div class="col-12" v-if="novoFunko.imagem">
        <p class="form-label text-muted small">Pré-visualização:</p>
        <div class="p-2 border rounded bg-light d-inline-block">
          <img
            :src="novoFunko.imagem"
            alt="Prévia do Funko"
            style="max-width: 150px; max-height: 150px; object-fit: contain;"
            @error="novoFunko.imagem = ''"
          />
        </div>
      </div>

      <!-- Estoque e avaliações -->
      <div class="col-12 mt-4">
        <h2 class="h5 border-bottom pb-2">Estoque e avaliações</h2>
      </div>

      <div class="col-md-4">
        <label for="estoque" class="form-label">Estoque inicial</label>
        <input
          id="estoque"
          type="number"
          class="form-control"
          v-model="novoFunko.estoque"
          min="0"
          required
        />
      </div>

      <div class="col-md-4">
        <label for="vendas" class="form-label">Vendas iniciais</label>
        <input
          id="vendas"
          type="number"
          class="form-control"
          v-model="novoFunko.vendas"
          min="0"
          required
        />
      </div>

      <div class="col-md-4">
        <label for="avaliacoes" class="form-label">Avaliação (0 a 5)</label>
        <input
          id="avaliacoes"
          type="number"
          class="form-control"
          v-model="novoFunko.Avaliações"
          min="0"
          max="5"
          step="0.1"
          placeholder="Ex: 4.8"
          required
        />
      </div>

      <!-- Botões de Ação -->
      <div class="col-12 d-flex gap-2 mt-4">
        <button
          class="btn btn-success d-flex align-items-center gap-2"
          type="submit"
          :disabled="salvando"
        >
          <span v-if="salvando" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ salvando ? 'Salvando...' : 'Cadastrar Funko' }}
        </button>

        <RouterLink
          class="btn btn-outline-secondary"
          :to="{ name: 'produtos' }"
        >
          Cancelar
        </RouterLink>
      </div>

    </form>
  </div>
</template>
