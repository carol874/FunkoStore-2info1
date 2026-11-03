# Guia de padronização do código

Este documento apresenta as ferramentas e configurações utilizadas para manter
o código do projeto organizado e padronizado.

## Por que padronizar o projeto?

Em projetos desenvolvidos por várias pessoas, cada integrante pode possuir
preferências diferentes no editor de código.

Entre as diferenças mais comuns estão:

* utilização de espaços ou tabulações;
* indentação com dois ou quatro espaços;
* presença ou ausência de ponto e vírgula;
* utilização de aspas simples ou duplas;
* organização dos atributos HTML;
* diferentes padrões de quebra de linha;
* espaços desnecessários no final das linhas.

Essas diferenças podem fazer o Git identificar alterações que não modificam o
funcionamento do projeto.

Como consequência, podem ocorrer:

* alterações desnecessárias no histórico;
* dificuldade para identificar o que realmente mudou;
* conflitos durante o `merge`;
* revisões de código mais demoradas;
* arquivos com estilos diferentes;
* dependência das configurações pessoais de cada integrante.

Por esse motivo, as principais regras de formatação e análise estão armazenadas
no próprio repositório.

> A configuração pessoal prepara o editor do desenvolvedor. As configurações do
> repositório determinam o padrão adotado pelo projeto.

## Ferramentas utilizadas

Cada ferramenta possui uma responsabilidade diferente.

| Ferramenta   | Responsabilidade                             |
| ------------ | -------------------------------------------- |
| EditorConfig | Define regras básicas dos arquivos           |
| Prettier     | Formata visualmente o código                 |
| ESLint       | Analisa o JavaScript e os componentes Vue    |
| Oxlint       | Realiza verificações rápidas complementares  |
| Volar        | Adiciona suporte aos arquivos Vue no VS Code |
| Vite         | Executa e compila a aplicação                |

Essas ferramentas trabalham em conjunto e não devem ser consideradas
substitutas umas das outras.

## EditorConfig

O EditorConfig define regras básicas que podem ser compreendidas por diferentes
editores de código.

As configurações estão no arquivo:

```text
.editorconfig
```

Conteúdo utilizado:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
max_line_length = 80

[*.md]
trim_trailing_whitespace = false
```

### Explicação das regras

| Propriedade                       | Finalidade                                            |
| --------------------------------- | ----------------------------------------------------- |
| `root = true`                     | Indica que este é o arquivo principal de configuração |
| `charset = utf-8`                 | Define a codificação dos arquivos                     |
| `end_of_line = lf`                | Padroniza a quebra de linha                           |
| `insert_final_newline = true`     | Adiciona uma linha vazia ao final                     |
| `indent_style = space`            | Utiliza espaços em vez de tabulações                  |
| `indent_size = 2`                 | Define dois espaços para cada indentação              |
| `trim_trailing_whitespace = true` | Remove espaços desnecessários                         |
| `max_line_length = 80`            | Indica a largura recomendada das linhas               |

A regra `max_line_length` funciona como referência para as ferramentas
compatíveis. Ela não impede manualmente a digitação após a coluna 80.

## Prettier

O Prettier é responsável pela apresentação visual do código.

Suas regras estão definidas no arquivo:

```text
.prettierrc.json
```

Configuração utilizada:

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "singleAttributePerLine": true,
  "bracketSameLine": false,
  "trailingComma": "all",
  "endOfLine": "lf"
}
```

### Principais regras

| Propriedade              | Finalidade                                     |
| ------------------------ | ---------------------------------------------- |
| `printWidth`             | Define 80 caracteres como largura preferencial |
| `tabWidth`               | Define dois espaços para indentação            |
| `useTabs`                | Impede a utilização de caracteres de tabulação |
| `semi`                   | Adiciona ponto e vírgula quando aplicável      |
| `singleQuote`            | Utiliza aspas simples no JavaScript            |
| `singleAttributePerLine` | Organiza atributos em linhas separadas         |
| `bracketSameLine`        | Posiciona o fechamento da tag em outra linha   |
| `trailingComma`          | Adiciona vírgula final quando suportado        |
| `endOfLine`              | Utiliza o padrão de quebra de linha `LF`       |

A propriedade `printWidth` representa uma largura preferencial. Dependendo do
tipo de conteúdo, o Prettier poderá manter uma linha com mais de 80 caracteres
quando não houver uma forma segura de quebrá-la.

### Exemplo de formatação

Antes da formatação:

```vue
<BaseButton type="button" variant="primary" disabled>
  Salvar
</BaseButton>
```

Depois da formatação:

```vue
<BaseButton
  type="button"
  variant="primary"
  disabled
>
  Salvar
</BaseButton>
```

Para formatar o projeto:

```bash
npm run format
```

## Prettier Ignore

O arquivo `.prettierignore` informa quais arquivos e diretórios não devem ser
formatados pelo Prettier.

```text
node_modules/
dist/
coverage/
.vite/
*.min.css
*.min.js
package-lock.json
```

Esses locais contêm dependências, arquivos compilados ou conteúdos gerados
automaticamente.

O `package-lock.json` deve continuar versionado pelo Git, mesmo não sendo
formatado manualmente pelo Prettier.

## ESLint

O ESLint analisa o código JavaScript e os componentes Vue para identificar
possíveis problemas.

Sua configuração está no arquivo:

```text
eslint.config.js
```

Diferentemente do Prettier, o ESLint não se limita à aparência do código. Ele
pode identificar:

* variáveis declaradas e não utilizadas;
* referências a valores inexistentes;
* construções inadequadas;
* problemas nos componentes Vue;
* regras inconsistentes no JavaScript.

Para executar a análise:

```bash
npm run lint
```

O arquivo `eslint.config.js` foi gerado pelo ambiente oficial de criação de
projetos Vue e não deve ser removido.

## Oxlint

O Oxlint realiza uma análise rápida complementar ao ESLint.

Sua configuração está no arquivo:

```text
.oxlintrc.json
```

O script de lint executa as duas ferramentas:

```json
"lint": "run-s \"lint:*\""
```

Isso significa que o comando:

```bash
npm run lint
```

executará:

1. Oxlint;
2. ESLint.

Os arquivos `.oxlintrc.json` e `eslint.config.js` foram gerados pelo
`create-vue` e devem permanecer versionados.

## Configurações do VS Code

As configurações compartilhadas pelo projeto estão dentro de:

```text
.vscode/
├── extensions.json
└── settings.json
```

### Extensões recomendadas

O arquivo `.vscode/extensions.json` recomenda as extensões necessárias para
trabalhar no projeto.

```json
{
  "recommendations": [
    "Vue.volar",
    "dbaeumer.vscode-eslint",
    "EditorConfig.EditorConfig",
    "oxc.oxc-vscode",
    "esbenp.prettier-vscode",
    "PKief.material-icon-theme"
  ]
}
```

As principais extensões são:

* **Vue — Official:** suporte aos arquivos `.vue`;
* **ESLint:** integração do ESLint com o editor;
* **EditorConfig:** aplicação das regras do `.editorconfig`;
* **Oxc:** integração das ferramentas Oxc;
* **Prettier:** formatação automática;
* **Material Icon Theme:** identificação visual dos arquivos.

O Material Icon Theme modifica apenas a aparência dos ícones. Ele não interfere
na formatação ou no funcionamento do projeto.

### Configurações compartilhadas

O arquivo `.vscode/settings.json` configura o comportamento do VS Code quando
este projeto estiver aberto.

Entre as configurações adotadas estão:

* indentação com dois espaços;
* utilização de espaços no lugar de tabulações;
* formatação automática ao salvar;
* Prettier como formatador;
* régua visual na coluna 80;
* correções do ESLint ao salvar;
* formatação dos arquivos Vue, JavaScript, JSON, CSS e HTML.

Preferências pessoais, como tema, fonte, tamanho da fonte e zoom, não devem ser
obrigatórias no projeto.

Essas preferências pertencem ao perfil pessoal de cada estudante.

## Vite e servidor de desenvolvimento

O projeto utiliza Vite como servidor de desenvolvimento e ferramenta de
compilação.

Para iniciar:

```bash
npm run dev
```

O terminal mostrará um endereço semelhante a:

```text
http://localhost:5173
```

Não utilize a extensão Live Server em projetos Vue com Vite. O Live Server não
executa o processo de compilação necessário para interpretar corretamente os
componentes `.vue`.

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos compilados serão criados em:

```text
dist/
```

## Fluxo recomendado de desenvolvimento

Ao começar a trabalhar no projeto:

```bash
npm install
npm run dev
```

Durante o desenvolvimento:

1. crie ou altere os componentes;
2. salve os arquivos;
3. observe a formatação aplicada pelo Prettier;
4. verifique os avisos apresentados pelo editor;
5. teste a aplicação no navegador.

Antes de criar um commit:

```bash
npm run format
npm run lint
npm run build
```

Depois, verifique as alterações:

```bash
git status
git diff
```

Se tudo estiver correto:

```bash
git add .
git commit -m "feat: descreva a alteração realizada"
git push
```

## Tipos de commit

Alguns prefixos podem ajudar a organizar o histórico:

| Prefixo    | Utilização                                       |
| ---------- | ------------------------------------------------ |
| `feat`     | Inclusão de uma funcionalidade                   |
| `fix`      | Correção de um problema                          |
| `docs`     | Alteração na documentação                        |
| `style`    | Alteração exclusivamente visual ou de formatação |
| `refactor` | Reorganização sem mudança de comportamento       |
| `chore`    | Configurações e tarefas de manutenção            |

Exemplos:

```bash
git commit -m "feat: adiciona formulário de pesquisa"
git commit -m "fix: corrige carregamento da página inicial"
git commit -m "docs: atualiza instruções do projeto"
```

## Configuração pessoal e configuração do projeto

É importante diferenciar os dois tipos de configuração.

### Configuração pessoal

Pode definir:

* tema claro ou escuro;
* família da fonte;
* tamanho da fonte;
* zoom;
* minimapa;
* salvamento automático;
* aparência dos ícones.

Essas configurações permanecem no perfil do VS Code do estudante.

### Configuração do projeto

Define:

* indentação;
* largura preferencial das linhas;
* formato das aspas;
* utilização de ponto e vírgula;
* organização dos atributos;
* extensões recomendadas;
* formatador utilizado;
* regras de análise do código.

Essas configurações ficam versionadas no Git e acompanham o repositório.

## Problemas comuns

### O Prettier não formata ao salvar

Verifique se:

1. a extensão Prettier está instalada;
2. o projeto foi aberto pela pasta raiz;
3. o arquivo `.prettierrc.json` existe;
4. o Prettier está definido como formatador;
5. `editor.formatOnSave` está habilitado.

Também é possível executar:

```bash
npm run format
```

### O VS Code mostra mais de um formatador

Abra um arquivo `.vue` e utilize:

```text
Format Document With...
```

Selecione:

```text
Prettier — Code formatter
```

Depois escolha:

```text
Configure Default Formatter
```

### O comando `npm run lint` apresenta erros

Leia a mensagem exibida no terminal. O lint normalmente informa:

* arquivo;
* linha;
* coluna;
* regra que foi violada.

Após corrigir o código, execute novamente:

```bash
npm run lint
```

### A página não abre com o Live Server

Projetos Vue com Vite devem ser iniciados com:

```bash
npm run dev
```

Abra o endereço apresentado pelo terminal.

### O Bootstrap não aparece

Confirme se o arquivo `src/main.js` contém:

```js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
```

## Checklist de validação

Antes de enviar uma atividade, confirme:

* [ ] as dependências foram instaladas;
* [ ] a aplicação inicia com `npm run dev`;
* [ ] o Prettier formata os arquivos;
* [ ] os atributos ficam organizados em linhas separadas;
* [ ] a indentação utiliza dois espaços;
* [ ] a régua aparece na coluna 80;
* [ ] o lint é executado sem erros;
* [ ] o build é concluído;
* [ ] somente os arquivos necessários aparecem no Git;
* [ ] o código foi enviado ao repositório remoto.

## Referências

* [Vue.js](https://vuejs.org/);
* [Vue Router](https://router.vuejs.org/);
* [Vite](https://vite.dev/);
* [Bootstrap](https://getbootstrap.com/);
* [Bootstrap Icons](https://icons.getbootstrap.com/);
* [EditorConfig](https://editorconfig.org/);
* [Prettier](https://prettier.io/);
* [ESLint](https://eslint.org/);
* [Oxlint](https://oxc.rs/docs/guide/usage/linter.html).
