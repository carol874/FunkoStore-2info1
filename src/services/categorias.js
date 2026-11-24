export const API_URL = (
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '')
).replace(/\/+$/, '');

async function requisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, opcoes);

  if (!resposta.ok) {
    throw new Error(`A API respondeu com o status HTTP ${resposta.status}.`);
  }

  const conteudo = await resposta.text();
  return conteudo ? JSON.parse(conteudo) : null;
}

export async function listarCategorias() {
  const categorias = await requisicao('/categorias');

  if (!Array.isArray(categorias)) {
    throw new Error('A resposta da API de categorias é inválida.');
  }

  return categorias;
}

export function criarCategoria(categoria) {
  return requisicao('/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  });
}

export function atualizarCategoria(id, categoria) {
  return requisicao(`/categorias/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  });
}

export function excluirCategoria(id) {
  return requisicao(`/categorias/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function listarProdutosPorCategoria(id) {
  const produtos = await requisicao(
    `/produtos?categoriaId=${encodeURIComponent(id)}`,
  );

  if (!Array.isArray(produtos)) {
    throw new Error('A resposta da API de produtos é inválida.');
  }

  return produtos;
}
