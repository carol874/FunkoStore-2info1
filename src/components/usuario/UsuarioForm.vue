<script setup>
import { computed, reactive, watch } from 'vue';
import { isValidEmail, isValidPhone, validarUsuario } from '../../utils/validacoes';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      nome: '',
      email: '',
      senha: '',
      telefone: '',
    }),
  },
  mode: {
    type: String,
    default: 'create',
  },
  submitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'submit']);

const form = reactive({
  nome: '',
  email: '',
  senha: '',
  telefone: '',
});

watch(
  () => props.modelValue,
  (value) => {
    form.nome = value?.nome ?? '';
    form.email = value?.email ?? '';
    form.senha = value?.senha ?? '';
    form.telefone = value?.telefone ?? '';
  },
  { immediate: true }
);

const isEditMode = computed(() => props.mode === 'edit');

function updateField(field, value) {
  form[field] = value;
  emit('update:modelValue', { ...props.modelValue, ...form, [field]: value });
}

function validateForm() {
  const errors = validarUsuario(
    {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      telefone: form.telefone,
    },
    { requirePassword: !isEditMode.value }
  );

  const normalizedErrors = { ...errors };

  if (!isEditMode.value && !form.senha) {
    normalizedErrors.senha = 'Senha é obrigatória no cadastro.';
  }

  if (form.email && !isValidEmail(form.email)) {
    normalizedErrors.email = 'Informe um e-mail válido.';
  }

  if (form.telefone && !isValidPhone(form.telefone)) {
    normalizedErrors.telefone = 'Telefone inválido. Digite com DDD e número.';
  }

  return normalizedErrors;
}

function submitForm() {
  const errors = validateForm();

  const hasErrors = Object.keys(errors).length > 0;

  if (hasErrors) {
    emit('submit', { errors, valid: false });
    return;
  }

  emit('submit', {
    valid: true,
    payload: {
      nome: form.nome.trim(),
      email: form.email.trim(),
      senha: form.senha,
      telefone: form.telefone.trim(),
    },
  });
}

defineExpose({ validateForm, submitForm });
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="submitForm">
    <div class="col-md-6">
      <label class="form-label" for="usuario-nome">Nome</label>
      <input
        id="usuario-nome"
        v-model="form.nome"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': validateForm().nome }"
        placeholder="Digite o nome completo"
        @input="updateField('nome', form.nome)"
      />
      <div v-if="validateForm().nome" class="invalid-feedback d-block">
        {{ validateForm().nome }}
      </div>
    </div>

    <div class="col-md-6">
      <label class="form-label" for="usuario-email">E-mail</label>
      <input
        id="usuario-email"
        v-model="form.email"
        type="email"
        class="form-control"
        :class="{ 'is-invalid': validateForm().email }"
        placeholder="seuemail@exemplo.com"
        @input="updateField('email', form.email)"
      />
      <div v-if="validateForm().email" class="invalid-feedback d-block">
        {{ validateForm().email }}
      </div>
    </div>

    <div v-if="!isEditMode" class="col-md-6">
      <label class="form-label" for="usuario-senha">Senha</label>
      <input
        id="usuario-senha"
        v-model="form.senha"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': validateForm().senha }"
        placeholder="Mínimo 6 caracteres"
        @input="updateField('senha', form.senha)"
      />
      <div v-if="validateForm().senha" class="invalid-feedback d-block">
        {{ validateForm().senha }}
      </div>
    </div>

    <div class="col-md-6">
      <label class="form-label" for="usuario-telefone">Telefone</label>
      <input
        id="usuario-telefone"
        v-model="form.telefone"
        type="tel"
        class="form-control"
        :class="{ 'is-invalid': validateForm().telefone }"
        placeholder="(47) 99999-9999"
        @input="updateField('telefone', form.telefone)"
      />
      <div v-if="validateForm().telefone" class="invalid-feedback d-block">
        {{ validateForm().telefone }}
      </div>
    </div>

    <div class="col-12 d-flex justify-content-end gap-2 mt-3">
      <button type="button" class="btn btn-outline-secondary" @click="$router.back()">
        Voltar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="submitting">
        <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {{ isEditMode ? 'Salvar alterações' : 'Cadastrar usuário' }}
      </button>
    </div>
  </form>
</template>
