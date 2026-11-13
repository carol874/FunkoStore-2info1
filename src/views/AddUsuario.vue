<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UsuarioForm from '../components/usuario/UsuarioForm.vue';
import { criarUsuario } from '../services/usuarioService';

const router = useRouter();
const formulario = ref({
  nome: '',
  email: '',
  senha: '',
  telefone: '',
});
const submitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

async function handleSubmit({ valid, payload, errors }) {
  if (!valid) {
    const firstError = Object.values(errors)[0];
    errorMessage.value = firstError || 'Verifique os dados informados.';
    successMessage.value = '';
    return;
  }

  submitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const { session } = await criarUsuario(payload);

    if (session) {
      router.push({ name: 'usuariosList' });
      return;
    }

    router.push({ name: 'login', query: { cadastro: 'sucesso' } });
  } catch (error) {
    const message = error?.message || 'Erro ao cadastrar usuário.';
    const normalizedMessage = message.toLowerCase();
    if (
      normalizedMessage.includes('duplicate') ||
      normalizedMessage.includes('already registered') ||
      normalizedMessage.includes('already exists')
    ) {
      errorMessage.value = 'Este e-mail já está cadastrado.';
      return;
    }

    errorMessage.value = message;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h1 class="mb-1">Cadastro de usuário</h1>
                <p class="text-muted mb-0">Crie uma conta usando o Supabase Auth.</p>
              </div>
              <button class="btn btn-outline-secondary" @click="router.push({ name: 'usuariosList' })">
                Voltar para listagem
              </button>
            </div>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="alert alert-success" role="alert">
              {{ successMessage }}
            </div>

            <UsuarioForm
              v-model="formulario"
              :submitting="submitting"
              mode="create"
              @submit="handleSubmit"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
