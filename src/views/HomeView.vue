<script setup>
import FunkoCard from '@/components/layout/FunkoCard.vue';
</script>

<template>
  <main class="container py-5">
    <div
      class="alert alert-success"
      role="alert"
    >
      <h1 class="alert-heading">
        <i class="bi bi-check-circle-fill me-2"></i>
        Projeto configurado!
      </h1>

      <p class="mb-0">
        Vue.js, Vue Router, Bootstrap e Bootstrap Icons estão funcionando.
      </p>

      <FunkoCard/>
    </div>
  </main>
</template>
