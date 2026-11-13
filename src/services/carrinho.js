const CHAVE_CARRINHO = 'funko-store-carrinho';
const EVENTO_CARRINHO = 'carrinho-atualizado';

function notificarAlteracao() {
  window.dispatchEvent(new Event(EVENTO_CARRINHO));
}

export function lerCarrinho() {
  const conteudo = window.localStorage.getItem(CHAVE_CARRINHO);

  if (!conteudo) {
    return [];
  }

  const itens = JSON.parse(conteudo);

  if (
    !Array.isArray(itens) ||
    itens.some(
      (item) =>
        item.id === undefined ||
        typeof item.quantidade !== 'number' ||
        item.quantidade < 1,
    )
  ) {
    throw new Error('Os dados salvos no carrinho são inválidos.');
  }

  return itens;
}

function salvarCarrinho(itens) {
  window.localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
  notificarAlteracao();
}

export function adicionarAoCarrinho(funko) {
  const itens = lerCarrinho();
  const estoque = Number(funko.estoque);

  if (!Number.isFinite(estoque) || estoque < 1) {
    throw new Error('Este Funko está indisponível no momento.');
  }

  const existente = itens.find((item) => String(item.id) === String(funko.id));

  if (existente) {
    if (existente.quantidade >= estoque) {
      throw new Error('A quantidade no carrinho atingiu o limite do estoque.');
    }

    existente.quantidade += 1;
  } else {
    itens.push({
      id: funko.id,
      nome: funko.nome,
      personagem: funko.personagem,
      preco: Number(funko.preco),
      imagem: funko.imagem,
      estoque,
      quantidade: 1,
    });
  }

  salvarCarrinho(itens);
  return itens;
}

export function atualizarQuantidade(id, quantidade) {
  const itens = lerCarrinho();
  const item = itens.find((produto) => String(produto.id) === String(id));

  if (!item) {
    throw new Error('O Funko não foi encontrado no carrinho.');
  }

  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > item.estoque) {
    throw new Error('A quantidade informada não está disponível em estoque.');
  }

  item.quantidade = quantidade;
  salvarCarrinho(itens);
  return itens;
}

export function removerDoCarrinho(id) {
  const itens = lerCarrinho().filter(
    (item) => String(item.id) !== String(id),
  );
  salvarCarrinho(itens);
  return itens;
}

export function esvaziarCarrinho() {
  salvarCarrinho([]);
  return [];
}

export function ouvirAlteracoesCarrinho(callback) {
  window.addEventListener(EVENTO_CARRINHO, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(EVENTO_CARRINHO, callback);
    window.removeEventListener('storage', callback);
  };
}
