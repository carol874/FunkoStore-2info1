import { API_URL } from './categorias';

const EVENTO_CARRINHO = 'carrinho-atualizado';

async function requisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, opcoes);

  if (!resposta.ok) {
    throw new Error(`A API respondeu com o status HTTP ${resposta.status}.`);
  }

  const conteudo = await resposta.text();
  return conteudo ? JSON.parse(conteudo) : null;
}

function notificarAlteracao() {
  window.dispatchEvent(new Event(EVENTO_CARRINHO));
}

export async function lerCarrinho() {
  const carrinhos = await requisicao('/carrinhos');

  if (!Array.isArray(carrinhos)) {
    throw new Error('A resposta da API do carrinho é inválida.');
  }

  const itens = await Promise.all(
    carrinhos.map(async item => {
      const funko = await requisicao(`/produtos/${item.funkoId}`);

      return {
        ...funko,
        id: item.id,
        funkoId: item.funkoId,
        quantidade: Number(item.quantidade),
        dataAdicao: item.dataAdicao,
      };
    }),
  );

  return itens;
}

export async function adicionarAoCarrinho(funko) {
  if (!funko || !funko.id) {
    throw new Error('Funko inválido.');
  }

  const estoque = Number(funko.estoque);

  if (!Number.isFinite(estoque) || estoque < 1) {
    throw new Error('Este Funko está indisponível no momento.');
  }

  const carrinhos = await requisicao('/carrinhos');

  const existente = carrinhos.find(
    item => String(item.funkoId) === String(funko.id),
  );

  if (existente) {
    const novaQuantidade = Number(existente.quantidade) + 1;

    if (novaQuantidade > estoque) {
      throw new Error('A quantidade no carrinho atingiu o limite do estoque.');
    }

    await requisicao(`/carrinhos/${existente.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...existente,
        quantidade: novaQuantidade,
      }),
    });
  } else {
    await requisicao('/carrinhos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        funkoId: funko.id,
        quantidade: 1,
        dataAdicao: new Date().toISOString(),
      }),
    });
  }

  notificarAlteracao();

  return await lerCarrinho();
}

export async function atualizarQuantidade(id, quantidade) {
  const item = await requisicao(`/carrinhos/${id}`);

  const funko = await requisicao(`/produtos/${item.funkoId}`);

  if (quantidade < 1) {
    throw new Error('A quantidade deve ser maior que zero.');
  }

  if (quantidade > Number(funko.estoque)) {
    throw new Error('A quantidade ultrapassa o estoque disponível.');
  }

  await requisicao(`/carrinhos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...item,
      quantidade: Number(quantidade),
    }),
  });

  notificarAlteracao();

  return await lerCarrinho();
}

export async function removerDoCarrinho(id) {
  await requisicao(`/carrinhos/${id}`, {
    method: 'DELETE',
  });

  notificarAlteracao();

  return await lerCarrinho();
}

export async function esvaziarCarrinho() {
  const carrinhos = await requisicao('/carrinhos');

  await Promise.all(
    carrinhos.map(item =>
      requisicao(`/carrinhos/${item.id}`, {
        method: 'DELETE',
      }),
    ),
  );

  notificarAlteracao();

  return [];
}

export function ouvirAlteracoesCarrinho(callback) {
  window.addEventListener(EVENTO_CARRINHO, callback);

  return () => {
    window.removeEventListener(EVENTO_CARRINHO, callback);
  };
}