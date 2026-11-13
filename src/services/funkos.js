import { API_URL } from './categorias';

async function requisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, opcoes);

  if (!resposta.ok) {
    throw new Error(`A API respondeu com o status HTTP ${resposta.status}.`);
  }

  const conteudo = await resposta.text();
  return conteudo ? JSON.parse(conteudo) : null;
}

export async function listarFunkos() {
  const funkos = await requisicao('/produtos');

  if (!Array.isArray(funkos)) {
    throw new Error('A resposta da API de produtos é inválida.');
  }

  return funkos;
}

export function criarFunko(funko) {
  return requisicao('/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(funko),
  });
}

export function atualizarFunko(id, alteracoes) {
  return requisicao(`/produtos/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alteracoes),
  });
}

export function excluirFunko(id) {
  return requisicao(`/produtos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
