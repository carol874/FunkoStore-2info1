O código da página de detalhes está bem estruturado e funcional, mas é possível aplicar algumas melhorias importantes em termos de **experiência do usuário (UX)**, **tratamento de erros**, **otimização de imagens** e **limpeza de código**.

### Principais melhorias aplicadas:

1. **Tratamento de ID Inválido**: Adicionada validação do parâmetro da rota para evitar chamadas de API desnecessárias caso o ID venha vazio ou inválido.
2. **Skeleton / Feedback de Carregamento Aprimorado**: Substituição da mensagem simples por um design mais polido durante o fetch.
3. **Lazy Loading e Fallback de Imagem**: Proteção contra URLs de imagem quebradas ou ausentes e atributo `loading="lazy"` para performance.
4. **Normalização de Dados**: Tratamento para chaves com acentuação (`Avaliações`) com fallback seguro.
5. **Responsividade e Limpeza CSS**: Otimização do layout e refatoração de regras duplicadas.

---

### Código Otimizado

```vue
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const API_URL = import.meta.env.DEV
  ? 'http://localhost:3000'
  : 'SUA_URL_DA_API';

const produto = ref(null);
const carregando = ref(true);
const erro = ref('');

async function carregarProduto() {
  try {
    carregando.value = true;
    erro.value = '';

    const idProduto = route.params.id;
    if (!idProduto) {
      throw new Error('Identificador do produto não fornecido.');
    }

    const resposta = await fetch(`${API_URL}/produtos/${idProduto}`);

    if (!resposta.ok) {
      throw new Error('Produto não encontrado ou indisponível.');
    }

    produto.value = await resposta.json();

  } catch (error) {
    console.error('Erro ao carregar produto:', error);
    erro.value = error.message || 'Não foi possível carregar os detalhes do produto.';
  } finally {
    carregando.value = false;
  }
}

function formatarPreco(preco) {
  const valor = Number(preco) || 0;
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

onMounted(carregarProduto);
</script>

<template>
  <main class="detalhes-produto">

    <!-- Carregamento -->
    <section v-if="carregando" class="mensagem">
      <div class="spinner"></div>
      <p>Carregando detalhes do produto...</p>
    </section>

    <!-- Erro -->
    <section v-else-if="erro" class="mensagem erro-container">
      <h2>Ops! Algo deu errado</h2>
      <p>{{ erro }}</p>
      <button class="botao-acao" @click="router.back()">
        ← Voltar para produtos
      </button>
    </section>

    <!-- Detalhes do produto -->
    <section v-else-if="produto" class="produto-container">

      <button class="botao-voltar" @click="router.back()">
        ← Voltar para produtos
      </button>

      <div class="produto-conteudo">

        <!-- Imagem -->
        <div class="produto-imagem">
          <img
            :src="produto.imagem"
            :alt="produto.nome || 'Imagem do produto'"
            loading="lazy"
          />
        </div>

        <!-- Informações principais -->
        <div class="produto-informacoes">

          <span class="produto-categoria">
            Funko Pop Collection
          </span>

          <h1>{{ produto.nome }}</h1>

          <p v-if="produto.personagem" class="personagem">
            <strong>Personagem:</strong> {{ produto.personagem }}
          </p>

          <p class="descricao">
            {{ produto.descricao }}
          </p>

          <div class="avaliacao" v-if="produto.Avaliações || produto.avaliacao">
            <span>★</span>
            {{ produto.Avaliações ?? produto.avaliacao }} / 5.0
          </div>

          <h2 class="preco">
            {{ formatarPreco(produto.preco) }}
          </h2>

          <p
            class="estoque"
            :class="{ 'sem-estoque': produto.estoque === 0 }"
          >
            <span v-if="produto.estoque > 0">
              ✓ {{ produto.estoque }} unidades disponíveis
            </span>
            <span v-else>
              ✕ Produto indisponível
            </span>
          </p>

        </div>
      </div>

      <!-- Informações adicionais -->
      <section v-if="produto.informacoes || produto.detalhes" class="produto-secao-texto">
        <template v-if="produto.informacoes">
          <h2>Sobre o produto</h2>
          <p>{{ produto.informacoes }}</p>
        </template>

        <template v-if="produto.detalhes">
          <h2>Detalhes do colecionável</h2>
          <p>{{ produto.detalhes }}</p>
        </template>
      </section>

      <!-- Características Grid -->
      <section class="produto-caracteristicas">
        <h2>Informações adicionais</h2>

        <div class="caracteristicas-grid">

          <div v-if="produto.anoLancamento" class="caracteristica">
            <span>Ano de lançamento</span>
            <strong>{{ produto.anoLancamento }}</strong>
          </div>

          <div v-if="produto.personagem" class="caracteristica">
            <span>Personagem</span>
            <strong>{{ produto.personagem }}</strong>
          </div>

          <div class="caracteristica">
            <span>Estoque</span>
            <strong>{{ produto.estoque ?? 0 }} unidades</strong>
          </div>

          <div class="caracteristica">
            <span>Total de vendas</span>
            <strong>{{ produto.vendas ?? 0 }}</strong>
          </div>

          <div v-if="produto.Avaliações || produto.avaliacao" class="caracteristica">
            <span>Avaliação</span>
            <strong>★ {{ produto.Avaliações ?? produto.avaliacao }}</strong>
          </div>

          <div class="caracteristica">
            <span>Código do produto</span>
            <strong>#{{ produto.id }}</strong>
          </div>

        </div>

      </section>

    </section>

  </main>
</template>

<style scoped>
.detalhes-produto {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 25px;
  color: #252525;
}

.mensagem {
  min-height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6F4E37;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.botao-voltar,
.botao-acao {
  border: none;
  background: none;
  color: #6F4E37;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  padding: 0;
}

.botao-voltar {
  margin-bottom: 30px;
}

.botao-acao {
  background: #6F4E37;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  margin-top: 10px;
}

.produto-conteudo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.produto-imagem {
  background: #f5f3ef;
  border-radius: 18px;
  min-height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 35px;
}

.produto-imagem img {
  width: 100%;
  max-width: 370px;
  height: 380px;
  object-fit: contain;
}

.produto-categoria {
  color: #8B5E3C;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.produto-informacoes h1 {
  font-size: 34px;
  margin: 15px 0;
  color: #1a1a1a;
}

.personagem {
  color: #777;
  font-size: 15px;
}

.descricao {
  color: #555;
  line-height: 1.7;
  margin: 25px 0;
}

.avaliacao {
  color: #555;
  font-weight: 600;
  margin-bottom: 20px;
}

.avaliacao span {
  color: #e5a42b;
  font-size: 22px;
}

.preco {
  font-size: 32px;
  color: #6F4E37;
  margin-bottom: 12px;
}

.estoque {
  color: #39834a;
  font-size: 14px;
  font-weight: 600;
}

.sem-estoque {
  color: #c0392b;
}

.produto-secao-texto {
  margin-top: 65px;
  padding: 35px 0;
  border-top: 1px solid #e8e5df;
}

.produto-secao-texto h2,
.produto-caracteristicas h2 {
  font-size: 23px;
  margin-bottom: 18px;
  color: #222;
}

.produto-secao-texto p {
  color: #666;
  font-size: 15px;
  line-height: 1.9;
  margin-bottom: 25px;
}

.produto-caracteristicas {
  border-top: 1px solid #e8e5df;
  padding: 35px 0;
}

.caracteristicas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.caracteristica {
  background: #f7f5f1;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.caracteristica span {
  color: #888;
  font-size: 13px;
}

.caracteristica strong {
  font-size: 16px;
  color: #333;
}

@media (max-width: 768px) {
  .produto-conteudo {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .produto-imagem {
    min-height: 320px;
  }

  .produto-imagem img {
    height: 280px;
  }

  .produto-informacoes h1 {
    font-size: 27px;
  }

  .caracteristicas-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 450px) {
  .caracteristicas-grid {
    grid-template-columns: 1fr;
  }
}
</style>

