<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { buscarMeuUsuario, excluirMeuUsuario } from '../services/usuarioService';
import { getCurrentUser, signOut } from '../services/authService';

const router = useRouter();
const usuario = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');

async function carregarPerfil() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    usuario.value = await buscarMeuUsuario();
  } catch (error) {
    errorMessage.value = error?.message || 'Não foi possível carregar seu perfil.';
  } finally {
    isLoading.value = false;
  }
}

async function excluirPerfil() {
  if (!window.confirm('Deseja realmente excluir sua conta? Esta ação não pode ser desfeita.')) {
    return;
  }

  try {
    await excluirMeuUsuario();
    await signOut();
    await router.replace({ name: 'login' });
  } catch (error) {
    errorMessage.value = error?.message || 'Não foi possível excluir sua conta.';
  }
}

onMounted(async () => {
  try {
    if (!(await getCurrentUser())) {
      await router.replace({ name: 'login' });
      return;
    }
  } catch (error) {
    errorMessage.value = error?.message || 'Não foi possível verificar sua sessão.';
    return;
  }

  await carregarPerfil();
});
</script>

<template>
  <main class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h1 class="mb-1">Meu perfil</h1>
        <p class="text-muted mb-0">Consulte e atualize os dados da sua conta.</p>
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>

        <div v-else-if="usuario" class="row g-3">
          <div class="col-md-6">
            <div class="text-muted small">ID</div>
            <div class="text-break">{{ usuario.id }}</div>
          </div>
          <div class="col-md-6">
            <div class="text-muted small">Nome</div>
            <div>{{ usuario.nome }}</div>
          </div>
          <div class="col-md-6">
            <div class="text-muted small">E-mail</div>
            <div>{{ usuario.email }}</div>
          </div>
          <div class="col-md-6">
            <div class="text-muted small">Telefone</div>
            <div>{{ usuario.telefone || 'Não informado' }}</div>
          </div>
          <div class="col-md-6">
            <div class="text-muted small">Data de cadastro</div>
            <div>{{ usuario.dataCadastro ? new Date(usuario.dataCadastro).toLocaleDateString('pt-BR') : '—' }}</div>
          </div>
          <div class="col-12 d-flex gap-2 mt-4">
            <button
              class="btn btn-primary"
              @click="router.push({ name: 'editarUsuario', params: { id: usuario.id } })"
            >
              <i class="bi bi-pencil-square me-2"></i>
              Editar meu perfil
            </button>
            <button class="btn btn-outline-danger" @click="excluirPerfil">
              <i class="bi bi-trash me-2"></i>
              Excluir minha conta
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
