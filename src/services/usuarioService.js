import { ensureSupabaseConfigured } from '../components/supabase';

function mapUsuario(user) {
  return {
    id: user.id,
    nome: user.user_metadata?.nome || '',
    email: user.email || '',
    telefone: user.user_metadata?.telefone || '',
    dataCadastro: user.created_at || null,
  };
}

async function getAuthenticatedUser() {
  const client = ensureSupabaseConfigured();
  const { data, error } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('Faça login para acessar seu perfil.');
  }

  return data.user;
}

export async function buscarMeuUsuario() {
  return mapUsuario(await getAuthenticatedUser());
}

export async function buscarUsuarioPorId(id) {
  const user = await getAuthenticatedUser();

  if (id !== user.id) {
    throw new Error('Você só pode consultar o seu próprio perfil.');
  }

  return mapUsuario(user);
}

export async function criarUsuario({ nome, email, senha, telefone }) {
  const client = ensureSupabaseConfigured();

  const { data, error } = await client.auth.signUp({
    email: email.trim(),
    password: senha,
    options: {
      data: {
        nome: nome.trim(),
        telefone: telefone?.trim() || '',
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('O Supabase não retornou o usuário criado.');
  }

  return { user: data.user, session: data.session };
}

export async function atualizarUsuario(id, { nome, email, telefone }) {
  const client = ensureSupabaseConfigured();
  const user = await getAuthenticatedUser();

  if (id !== user.id) {
    throw new Error('Você só pode atualizar o seu próprio perfil.');
  }

  const updates = {
    data: {
      ...user.user_metadata,
      nome: nome.trim(),
      telefone: telefone?.trim() || '',
    },
  };
  const updatedEmail = email.trim();

  if (user.email !== updatedEmail) {
    updates.email = updatedEmail;
  }

  const { data, error } = await client.auth.updateUser(updates);

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('O Supabase não retornou o perfil atualizado.');
  }

  return mapUsuario(data.user);
}

export async function excluirMeuUsuario() {
  const client = ensureSupabaseConfigured();
  const user = await getAuthenticatedUser();
  const { error } = await client.functions.invoke('delete-user', {
    body: { user_id: user.id },
  });

  if (error) {
    throw error;
  }

  return true;
}
