<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UsuarioForm from '../components/usuario/UsuarioForm.vue';
import { buscarUsuarioPorId, atualizarUsuario } from '../services/usuarioService';
import { getCurrentUser } from '../services/authService';

const route = useRoute();
const router = useRouter();
const usuario = ref({ nome: '', email: '', telefone: '' });
const submitting = ref(false);
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

async function loadUsuario() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push({ name: 'login' });
      return;
    }

    const userId = route.params.id;
    const data = await buscarUsuarioPorId(userId);
    usuario.value = {
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
    };
  } catch (error) {
    errorMessage.value = error?.message || 'Erro ao carregar usuário.';
  } finally {
    loading.value = false;
  }
}

async function handleSubmit({ valid, payload, errors }) {
  if (!valid) {
    const firstError = Object.values(errors)[0];
    errorMessage.value = firstError || 'Verifique os campos do formulário.';
    successMessage.value = '';
    return;
  }

  submitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await atualizarUsuario(route.params.id, payload);
    successMessage.value = 'Usuário atualizado com sucesso.';
    router.push({ name: 'usuariosList' });
  } catch (error) {
    errorMessage.value = error?.message || 'Erro ao atualizar usuário.';
  } finally {
    submitting.value = false;
  }
}

onMounted(loadUsuario);
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h1 class="mb-1">Editar usuário</h1>
                <p class="text-muted mb-0">Atualize os dados cadastrais do usuário.</p>
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

            <div v-else>
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>

              <div v-if="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
              </div>

              <UsuarioForm
                v-model="usuario"
                :submitting="submitting"
                mode="edit"
                @submit="handleSubmit"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
