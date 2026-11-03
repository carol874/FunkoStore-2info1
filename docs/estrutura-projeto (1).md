# Estrutura do projeto

Este documento apresenta a organização recomendada para os projetos Vue.js
criados a partir do template.

## Estrutura inicial

```text
.
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── docs/
│   ├── img/
│   ├── como-utilizar-template.md
│   ├── estrutura-projeto.md
│   ├── guia-padronizacao-codigo.md
│   └── validacao-template.md
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── global.css
│   ├── components/
│   │   ├── base/
│   │   └── layout/
│   ├── router/
│   │   └── index.js
│   ├── services/
│   ├── views/
│   │   └── HomeView.vue
│   ├── App.vue
│   └── main.js
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .nvmrc
├── .oxlintrc.json
├── .prettierignore
├── .prettierrc.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## `public`

Armazena arquivos públicos que não precisam ser processados pelo Vite, como
`favicon.ico` e `robots.txt`.

## `src`

Contém o código-fonte da aplicação. A maior parte do desenvolvimento acontece
nesse diretório.

## `src/assets`

Armazena recursos processados pelo Vite, como estilos, imagens e fontes.

```text
assets/
├── images/
└── styles/
    └── global.css
```

Use `global.css` para estilos aplicados à aplicação inteira, como variáveis de
cores, tipografia e regras gerais.

## `src/components/base`

Componentes pequenos, genéricos e reutilizáveis:

```text
BaseAlert.vue
BaseButton.vue
BaseInput.vue
BaseModal.vue
```

Um componente base não deve conhecer uma funcionalidade específica.

## `src/components/layout`

Componentes responsáveis pela estrutura visual:

```text
AppFooter.vue
AppHeader.vue
AppNavbar.vue
AppSidebar.vue
```

O prefixo `App` identifica componentes estruturais da aplicação.

## `src/views`

Armazena componentes que representam páginas acessadas por meio das rotas:

```text
views/
├── HomeView.vue
├── AboutView.vue
└── NotFoundView.vue
```

Utilize o sufixo `View` para diferenciar páginas de componentes reutilizáveis.

## Componentes específicos de uma funcionalidade

Quando um componente pertence somente a uma funcionalidade, mantenha-o próximo
da página correspondente:

```text
views/
└── projects/
    ├── components/
    │   ├── ProjectCard.vue
    │   └── ProjectForm.vue
    ├── ProjectDetailsView.vue
    └── ProjectsView.vue
```

Isso evita que `src/components` misture componentes de contextos diferentes.

## `src/router`

Centraliza a configuração das rotas:

```js
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
  ],
});

export default router;
```

## `src/services`

Concentra a comunicação com APIs e serviços externos:

```text
services/
├── api.js
├── ibgeService.js
└── projectService.js
```

Evite espalhar chamadas do Axios por vários componentes. Centralizá-las
facilita manutenção, testes e tratamento de erros.

## `App.vue`

É o componente principal e normalmente apresenta o layout global e o local em
que as páginas são renderizadas:

```vue
<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>
```

## `main.js`

É o ponto de entrada. Cria a aplicação, registra o Router e importa os estilos:

```js
import { createApp } from 'vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.vue';
import router from './router';
import './assets/styles/global.css';

createApp(App).use(router).mount('#app');
```

## Convenções de nomes

| Elemento | Padrão | Exemplo |
| --- | --- | --- |
| Componentes Vue | PascalCase | `ProjectCard.vue` |
| Páginas | PascalCase + View | `ProjectsView.vue` |
| Componentes base | Prefixo Base | `BaseButton.vue` |
| Componentes de layout | Prefixo App | `AppHeader.vue` |
| Serviços | camelCase + Service | `projectService.js` |
| Arquivos JavaScript | camelCase | `formatCurrency.js` |
| Rotas | kebab-case | `/project-details` |

## Pastas vazias

O Git não versiona diretórios vazios. Para preservar uma pasta no template,
adicione um arquivo `.gitkeep` ou crie um arquivo real dentro dela. Remova o
`.gitkeep` quando a pasta passar a possuir conteúdo.
