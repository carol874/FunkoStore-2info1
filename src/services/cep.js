const URL_VIACEP = 'https://viacep.com.br/ws';

export async function buscarEnderecoPorCep(cep, { signal } = {}) {
  const cepNormalizado = String(cep || '').replace(/\D/g, '');

  if (cepNormalizado.length !== 8) {
    throw new Error('Digite um CEP válido com 8 números.');
  }

  let resposta;

  try {
    resposta = await fetch(
      `${URL_VIACEP}/${encodeURIComponent(cepNormalizado)}/json/`,
      { signal },
    );
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro;
    throw new Error(
      'Não foi possível conectar à API ViaCEP. Tente novamente.',
      {
        cause: erro,
      },
    );
  }

  if (!resposta.ok) {
    throw new Error(
      `A API ViaCEP respondeu com o status HTTP ${resposta.status}.`,
    );
  }

  let endereco;
  try {
    endereco = await resposta.json();
  } catch {
    throw new Error('A API ViaCEP retornou uma resposta inválida.');
  }

  if (!endereco || typeof endereco !== 'object') {
    throw new Error('A API ViaCEP retornou uma resposta inválida.');
  }

  if (endereco.erro) {
    throw new Error(
      'CEP não encontrado. Confira os números e tente novamente.',
    );
  }

  if (!endereco.localidade || !endereco.uf) {
    throw new Error(
      'A API ViaCEP não retornou um endereço completo para este CEP.',
    );
  }

  return {
    cep: endereco.cep || cepNormalizado,
    logradouro: endereco.logradouro || '',
    bairro: endereco.bairro || '',
    cidade: endereco.localidade,
    estado: endereco.uf,
  };
}
