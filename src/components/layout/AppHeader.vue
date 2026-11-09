<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark"
    style="background-color: rgb(255, 160, 122)"
  >
    <div class="container-fluid">

      <RouterLink
        class="navbar-brand fw-bold"
        to="/"
      >
         <a>
             <i class="bi bi-bag-heart-fill fs-2 ">
                FunkoStore
             </i>
         </a>
      

      
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#menuPrincipal"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse"
        id="menuPrincipal"
      >

        <div class="navbar-nav ms-auto fs-5">

          <RouterLink class="nav-link " to="/">
            Início
          </RouterLink>

          <RouterLink class="nav-link" to="/usuario/add">
            Cadastre-se
          </RouterLink>

          <RouterLink class="nav-link" to="/pedidos">
           Meu carrinho
          </RouterLink>

        </div>
      </div>
    </div>
  </nav>
</template>