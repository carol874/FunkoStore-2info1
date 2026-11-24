
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UsuarioForm from '../components/usuario/UsuarioForm.vue';
import { criarUsuario } from '../services/usuarioService';
import { RouterLink } from 'vue-router';
import { cadastrarUsuario } from '@/services/usuarios';

defineOptions({ name: 'AddUsuario' });

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

const usuario = ref({
  nome: '',
  email: '',
  telefone: '',
});

const salvando = ref(false);
const mensagemErro = ref('');
const mensagemSucesso = ref('');

async function enviarCadastro() {
  if (salvando.value) return;

  salvando.value = true;
  mensagemErro.value = '';
  mensagemSucesso.value = '';

  try {
    const novoUsuario = await cadastrarUsuario(usuario.value);

    mensagemSucesso.value = `Cadastro realizado com sucesso para ${novoUsuario.nome}.`;

    usuario.value = {
      nome: '',
      email: '',
      telefone: '',
    };
  } catch (erro) {
    console.error('Erro ao cadastrar usuário:', erro);

    mensagemErro.value =
      erro.message || 'Não foi possível realizar o cadastro.';
  } finally {
    salvando.value = false;
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
                <p class="text-muted mb-0">
                  Crie uma conta usando o Supabase Auth.
                </p>
              </div>

              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="router.push({ name: 'usuariosList' })"
              >
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

  <section class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-7 col-xl-6">

        <header class="mb-4">
          <h1 class="h2 fw-bold mb-1">Cadastro</h1>
          <p class="text-body-secondary mb-0">
            Informe seus dados para criar seu cadastro na FunkoStore.
          </p>
        </header>

        <div v-if="mensagemErro" class="alert alert-danger" role="alert">
          {{ mensagemErro }}
        </div>

        <div v-if="mensagemSucesso" class="alert alert-success" role="status">
          {{ mensagemSucesso }}

          <RouterLink class="alert-link ms-1" to="/pedidos">
            Ver pedidos
          </RouterLink>
        </div>

        <form
          class="card border-0 shadow-sm"
          @submit.prevent="enviarCadastro"
        >
          <div class="card-body p-4">

            <div class="mb-3">
              <label class="form-label" for="cadastro-nome">
                Nome completo
              </label>

              <input
                id="cadastro-nome"
                v-model="usuario.nome"
                class="form-control"
                type="text"
                autocomplete="name"
                maxlength="120"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label" for="cadastro-email">
                E-mail
              </label>

              <input
                id="cadastro-email"
                v-model="usuario.email"
                class="form-control"
                type="email"
                autocomplete="email"
                maxlength="160"
                required
              />
            </div>

            <div class="mb-4">
              <label class="form-label" for="cadastro-telefone">
                Telefone
                <span class="text-body-secondary">(opcional)</span>
              </label>

              <input
                id="cadastro-telefone"
                v-model="usuario.telefone"
                class="form-control"
                type="tel"
                autocomplete="tel"
                minlength="10"
                maxlength="20"
                pattern="[\d\s()+.-]{10,20}"
              />
            </div>

            <p class="small text-body-secondary">
              Este cadastro registra seus dados de contato. O sistema não possui
              autenticação e não solicita nem armazena senhas.
            </p>

            <div class="d-flex flex-wrap gap-2">
              <button
                class="btn btn-primary"
                type="submit"
                :disabled="salvando"
              >
                <span
                  v-if="salvando"
                  class="spinner-border spinner-border-sm me-1"
                  aria-hidden="true"
                ></span>

                {{ salvando ? 'Cadastrando...' : 'Criar cadastro' }}
              </button>

              <button
                v-if="mensagemSucesso"
                class="btn btn-outline-secondary"
                type="button"
                @click="router.push('/')"
              >
                Voltar ao início
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  </section>
</template>
