import { API_URL } from './categorias';

async function requisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, opcoes);

  if (!resposta.ok) {
    throw new Error(`A API respondeu com o status HTTP ${resposta.status}.`);
  }

  const conteudo = await resposta.text();
  return conteudo ? JSON.parse(conteudo) : null;
}

function validarUsuario(usuario) {
  if (
    !usuario ||
    typeof usuario.nome !== 'string' ||
    !usuario.nome.trim() ||
    typeof usuario.email !== 'string' ||
    !usuario.email.trim()
  ) {
    throw new Error('Nome e e-mail são obrigatórios.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email.trim())) {
    throw new Error('Informe um e-mail válido.');
  }

  if (usuario.telefone) {
    const telefone = usuario.telefone.trim();
    const quantidadeDigitos = telefone.replace(/\D/g, '').length;

    if (
      !/^[\d\s()+.-]+$/.test(telefone) ||
      quantidadeDigitos < 10 ||
      quantidadeDigitos > 13
    ) {
      throw new Error('Informe um telefone válido.');
    }
  }
}

export async function listarUsuarios() {
  const usuarios = await requisicao('/usuarios');

  if (!Array.isArray(usuarios)) {
    throw new Error('A resposta da API de usuários é inválida.');
  }

  return usuarios;
}

export async function cadastrarUsuario(usuario) {
  validarUsuario(usuario);

  const usuarios = await listarUsuarios();
  const emailNormalizado = usuario.email.trim().toLocaleLowerCase('pt-BR');
  const emailDuplicado = usuarios.some(
    (existente) =>
      typeof existente.email === 'string' &&
      existente.email.trim().toLocaleLowerCase('pt-BR') === emailNormalizado,
  );

  if (emailDuplicado) {
    throw new Error('Já existe um cadastro com este e-mail.');
  }

  return requisicao('/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: usuario.nome.trim(),
      email: usuario.email.trim(),
      telefone: usuario.telefone?.trim() || '',
      dataCadastro: new Date().toISOString(),
    }),
  });
}
