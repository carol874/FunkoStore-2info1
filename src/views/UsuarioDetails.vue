<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { buscarUsuarioPorId } from '../services/usuarioService';

const route = useRoute();
const router = useRouter();
const usuario = ref(null);
const loading = ref(true);
const errorMessage = ref('');

async function carregarUsuario() {
  loading.value = true;
  errorMessage.value = '';

  try {
    usuario.value = await buscarUsuarioPorId(route.params.id);
  } catch (error) {
    errorMessage.value = error?.message || 'Erro ao buscar usuário.';
  } finally {
    loading.value = false;
  }
}

onMounted(carregarUsuario);
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h1 class="mb-1">Detalhes do usuário</h1>
                <p class="text-muted mb-0">Consulta rápida dos dados cadastrados.</p>
              </div>
              <button class="btn btn-outline-secondary" @click="router.push({ name: 'usuariosList' })">
                Voltar para listagem
              </button>
            </div>

            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
              </div>
            </div>

            <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <div v-else-if="usuario" class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">Nome</label>
                <div class="form-control bg-light">{{ usuario.nome }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">E-mail</label>
                <div class="form-control bg-light">{{ usuario.email }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">Telefone</label>
                <div class="form-control bg-light">{{ usuario.telefone || 'Não informado' }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">Data de cadastro</label>
                <div class="form-control bg-light">{{ usuario.dataCadastro ? new Date(usuario.dataCadastro).toLocaleString('pt-BR') : '—' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
