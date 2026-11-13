<script setup>
import { computed } from 'vue';

const props = defineProps({
  produto: {
    type: Object,
    required: true,
    validator: (p) => typeof p === 'object' && p !== null && 'id' in p
  }
});

// Helper de formatação de preço seguro
const precoFormatado = computed(() => {
  const valor = Number(props.produto?.preco) || 0;
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
});

// Avaliação normalizada (suporta diferentes chaves da API)
const avaliacaoFormatada = computed(() => {
  return props.produto?.['Avaliações'] ?? props.produto?.avaliacao ?? 'N/A';
});
</script>

<template>
  <article class="produto-card">

    <!-- Imagem e Badges -->
    <div class="produto-imagem">
      <img
        :src="produto.imagem"
        :alt="produto.nome || 'Imagem do produto'"
        loading="lazy"
      />

      <span class="produto-id" aria-label="ID do produto">
        #{{ produto.id }}
      </span>

      <!-- Badge de Indisponível se o estoque for zero -->
      <span v-if="produto.estoque === 0" class="badge-esgotado">
        Esgotado
      </span>
    </div>

    <!-- Conteúdo Principal -->
    <div class="produto-conteudo">

      <h2>{{ produto.nome }}</h2>

      <p class="produto-descricao">
        {{ produto.descricao }}
      </p>

      <div v-if="produto.personagem" class="produto-personagem">
        <strong>Personagem:</strong> {{ produto.personagem }}
      </div>

      <div class="produto-preco">
        {{ precoFormatado }}
      </div>

      <div class="divisor"></div>

      <!-- Informações Comerciais -->
      <div class="produto-dados">
        <div>
          <span>Estoque</span>
          <strong>{{ produto.estoque ?? 0 }} un.</strong>
        </div>

        <div>
          <span>Vendas</span>
          <strong>{{ produto.vendas ?? 0 }}</strong>
        </div>

        <div>
          <span>Avaliação</span>
          <strong>★ {{ avaliacaoFormatada }}</strong>
        </div>
      </div>

      <div class="divisor"></div>

      <!-- Ação / Detalhes Rápidos -->
      <div class="produto-footer">
        <RouterLink
          v-if="produto.id"
          :to="{ name: 'detalhes-produto', params: { id: produto.id } }"
          class="btn-detalhes"
        >
          Ver Detalhes →
        </RouterLink>
      </div>

    </div>

  </article>
</template>

<style scoped>
.produto-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.produto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.produto-imagem {
  height: 230px;
  background: #f8f9fa;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  overflow: hidden;
}

.produto-imagem img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.produto-card:hover .produto-imagem img {
  transform: scale(1.05);
}

.produto-id {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(34, 34, 34, 0.85);
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.badge-esgotado {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #c0392b;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.produto-conteudo {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.produto-conteudo h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1a1a1a;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.produto-descricao {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 12px;
  min-height: 40px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.produto-personagem {
  font-size: 14px;
  margin-bottom: 12px;
  color: #444;
}

.produto-preco {
  font-size: 22px;
  font-weight: 700;
  color: #6f4e37;
  margin-bottom: 12px;
}

.divisor {
  height: 1px;
  background-color: #eee;
  margin: 12px 0;
}

.produto-dados {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  text-align: center;
}

.produto-dados div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.produto-dados span {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.produto-dados strong {
  font-size: 13px;
  color: #222;
}

.produto-footer {
  margin-top: auto;
  padding-top: 12px;
}

.btn-detalhes {
  display: block;
  width: 100%;
  text-align: center;
  background-color: #f7f5f1;
  color: #6f4e37;
  font-weight: 600;
  font-size: 14px;
  padding: 10px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-detalhes:hover {
  background-color: #6f4e37;
  color: #fff;
}
</style>
