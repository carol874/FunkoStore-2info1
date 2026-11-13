import { API_URL } from './categorias';

const STATUS_PEDIDO = [
  'Pendente',
  'Confirmado',
  'Enviado',
  'Entregue',
  'Cancelado',
];

async function requisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, opcoes);

  if (!resposta.ok) {
    throw new Error(`A API respondeu com o status HTTP ${resposta.status}.`);
  }

  const conteudo = await resposta.text();
  return conteudo ? JSON.parse(conteudo) : null;
}

function textoPreenchido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function validarPedido(pedido) {
  if (
    !pedido ||
    typeof pedido !== 'object' ||
    !textoPreenchido(pedido.cliente?.nome) ||
    !textoPreenchido(pedido.cliente?.email) ||
    !textoPreenchido(pedido.enderecoEntrega?.logradouro) ||
    !textoPreenchido(pedido.enderecoEntrega?.numero) ||
    !textoPreenchido(pedido.enderecoEntrega?.cidade) ||
    !textoPreenchido(pedido.enderecoEntrega?.estado)
  ) {
    throw new Error(
      'Os dados do cliente e do endereço de entrega são obrigatórios.',
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pedido.cliente.email.trim())) {
    throw new Error('O e-mail informado para o pedido é inválido.');
  }

  if (
    !Number.isFinite(Number(pedido.valorTotal)) ||
    Number(pedido.valorTotal) <= 0
  ) {
    throw new Error('O valor total do pedido deve ser maior que zero.');
  }

  if (!STATUS_PEDIDO.includes(pedido.status)) {
    throw new Error('O status informado para o pedido é inválido.');
  }

  if (
    !Array.isArray(pedido.itens) ||
    pedido.itens.length === 0 ||
    pedido.itens.some(
      (item) =>
        item.produtoId === undefined ||
        item.produtoId === null ||
        !textoPreenchido(item.nome) ||
        !Number.isInteger(item.quantidade) ||
        item.quantidade < 1 ||
        !Number.isFinite(Number(item.precoUnitario)) ||
        Number(item.precoUnitario) <= 0,
    )
  ) {
    throw new Error('O pedido precisa conter itens válidos.');
  }

  if (!pedido.dataPedido || Number.isNaN(Date.parse(pedido.dataPedido))) {
    throw new Error('A data do pedido é obrigatória.');
  }
}

export async function listarPedidos() {
  const pedidos = await requisicao('/pedidos');

  if (!Array.isArray(pedidos)) {
    throw new Error('A resposta da API de pedidos é inválida.');
  }

  return pedidos;
}

export async function buscarPedido(id) {
  const pedido = await requisicao(`/pedidos/${encodeURIComponent(id)}`);

  if (!pedido || typeof pedido !== 'object') {
    throw new Error('A resposta da API para este pedido é inválida.');
  }

  return pedido;
}

export function criarPedido(pedido) {
  validarPedido(pedido);

  return requisicao('/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  });
}

export function atualizarPedido(id, alteracoes) {
  if (
    !alteracoes ||
    typeof alteracoes !== 'object' ||
    !STATUS_PEDIDO.includes(alteracoes.status)
  ) {
    throw new Error('O status informado para o pedido é inválido.');
  }

  return requisicao(`/pedidos/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alteracoes),
  });
}

export function excluirPedido(id) {
  return requisicao(`/pedidos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export { STATUS_PEDIDO };
