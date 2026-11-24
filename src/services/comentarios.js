
import { API_URL } from './categorias';

async function requisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, opcoes);

  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }

  const conteudo = await resposta.text();
  return conteudo ? JSON.parse(conteudo) : null;
}

export async function listarComentarios(produtoId) {
  const comentarios = await requisicao('/comentarios');

  if (!Array.isArray(comentarios)) {
    throw new Error('Não foi possível carregar os comentários.');
  }

  return comentarios
    .filter(item => String(item.produtoId) === String(produtoId))
    .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
}

export async function verificarCompra(email, produtoId) {
  const [usuarios, pedidos] = await Promise.all([
    requisicao('/usuarios'),
    requisicao('/pedidos'),
  ]);

  const emailNormalizado = email.trim().toLowerCase();

  const usuario = usuarios.find(
    item => item.email?.trim().toLowerCase() === emailNormalizado
  );

  if (!usuario) return null;

  const comprou = pedidos.some(pedido => {
    const mesmoUsuario =
      pedido.cliente?.email?.trim().toLowerCase() === emailNormalizado ||
      String(pedido.usuarioId) === String(usuario.id);

    const pedidoValido = pedido.status !== 'Cancelado';

    const temProduto = pedido.itens?.some(
      item => String(item.produtoId) === String(produtoId)
    );

    return mesmoUsuario && pedidoValido && temProduto;
  });

  return comprou ? usuario : null;
}

export async function criarComentario(usuario, produtoId, texto) {
  const usuarioConfirmado = await verificarCompra(usuario.email, produtoId);

  if (!usuarioConfirmado || String(usuarioConfirmado.id) !== String(usuario.id)) {
    throw new Error('Você precisa comprar este Funko para comentar.');
  }

  const comentarios = await listarComentarios(produtoId);

  const jaComentou = comentarios.some(
    item => String(item.usuarioId) === String(usuario.id)
  );

  if (jaComentou) {
    throw new Error('Você já comentou este Funko.');
  }

  return requisicao('/comentarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      produtoId: String(produtoId),
      usuarioId: String(usuario.id),
      usuarioNome: usuario.nome,
      usuarioEmail: usuario.email,
      texto: texto.trim(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    }),
  });
}

export async function atualizarComentario(id, usuario, texto) {
  const comentario = await requisicao(`/comentarios/${encodeURIComponent(id)}`);

  if (String(comentario.usuarioId) !== String(usuario.id)) {
    throw new Error('Você não pode editar este comentário.');
  }

  return requisicao(`/comentarios/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      texto: texto.trim(),
      dataAtualizacao: new Date().toISOString(),
    }),
  });
}

export async function excluirComentario(id, usuario) {
  const comentario = await requisicao(`/comentarios/${encodeURIComponent(id)}`);

  if (String(comentario.usuarioId) !== String(usuario.id)) {
    throw new Error('Você não pode excluir este comentário.');
  }

  return requisicao(`/comentarios/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
