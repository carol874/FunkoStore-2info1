<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { signInWithEmail } from '../services/authService';

const route = useRoute();
const router = useRouter();
const form = ref({ email: '', password: '' });
const loading = ref(false);
const errorMessage = ref('');
const registrationSucceeded = route.query.cadastro === 'sucesso';

async function handleLogin() {
  errorMessage.value = '';

  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Informe e-mail e senha para continuar.';
    return;
  }

  loading.value = true;

  try {
    await signInWithEmail(form.value.email.trim(), form.value.password);
    router.push({ name: 'usuariosList' });
  } catch (error) {
    errorMessage.value = error?.message || 'Não foi possível fazer login.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="container d-flex justify-content-center align-items-center min-vh-75 py-5">
    <div class="card shadow-sm w-100" style="max-width: 450px;">
      <div class="card-body p-4">
        <h1 class="mb-3 text-center">Login</h1>

        <div v-if="registrationSucceeded" class="alert alert-success" role="status">
          Cadastro recebido. Confira seu e-mail para confirmar a conta e depois entre.
        </div>

        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label" for="login-email">E-mail</label>
            <input id="login-email" v-model="form.email" type="email" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label" for="login-password">Senha</label>
            <input id="login-password" v-model="form.password" type="password" class="form-control" required />
          </div>

          <button class="btn btn-primary w-100" :disabled="loading" type="submit">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
