# Como utilizar o template

Este guia apresenta o processo para criar um projeto independente a partir do
repositório `tec-vue-bootstrap-template`.

## Template, fork e clone

| Operação | Finalidade |
| --- | --- |
| **Use this template** | Iniciar um projeto independente com a estrutura pronta |
| **Fork** | Criar uma derivação vinculada a um repositório existente |
| **Clone** | Baixar um repositório para a máquina |

Para iniciar uma nova atividade, utilize **Use this template**. O fork deve ser
utilizado quando a intenção for contribuir com um projeto existente sem acesso
direto de escrita.

## Criar o repositório

1. acesse o
   [repositório do template](https://github.com/ifc-dev-web2/tec-vue-bootstrap-template);
2. clique em **Use this template**;
3. selecione **Create a new repository**;
4. escolha sua conta como proprietária;
5. informe o nome do projeto;
6. escolha a visibilidade solicitada na atividade;
7. clique em **Create repository**.

O novo repositório será independente e terá seu próprio histórico de commits.

## Clonar o projeto

No novo repositório, clique em **Code**, selecione **HTTPS** e copie o endereço.

```bash
git clone https://github.com/SEU-USUARIO/NOME-DO-PROJETO.git
cd NOME-DO-PROJETO
```

Confira o repositório remoto:

```bash
git remote -v
```

O endereço deve apontar para o repositório criado em sua conta.

## Personalizar o nome do pacote

O GitHub altera o nome do repositório, mas os arquivos copiados ainda possuem
o nome original do template.

Antes de instalar as dependências, atualize o campo `name` do `package.json`:

```bash
npm pkg set name=nome-do-projeto
```

Exemplo:

```bash
npm pkg set name=cidade-sustentavel
```

Utilize letras minúsculas, números quando necessário e hífens para separar
palavras. Não utilize espaços ou acentos. Depois, atualize o título e a
descrição do `README.md`.

## Selecionar a versão do Node.js

O arquivo `.nvmrc` define a versão recomendada:

```text
22.18.0
```

No Linux ou macOS com NVM:

```bash
nvm install
nvm use
```

No Windows com `nvm-windows`:

```powershell
nvm install 22.18.0
nvm use 22.18.0
```

Confira a versão selecionada:

```bash
node --version
```

Se o npm apresentar `EBADENGINE`, verifique a versão do Node.js antes de
continuar.

## Instalar as dependências

```bash
npm install
```

Esse comando instala as dependências e mantém o `package-lock.json`
sincronizado com o `package.json`. Não envie a pasta `node_modules` ao GitHub.

## Instalar as extensões recomendadas

Ao abrir o projeto no VS Code, aceite a recomendação de extensões definida em
`.vscode/extensions.json`:

- Vue — Official;
- ESLint;
- EditorConfig;
- Oxc;
- Prettier;
- Material Icon Theme.

## Executar e validar

```bash
npm run dev
npm run format
npm run lint
npm run build
```

Projetos Vue com Vite não devem ser executados com o Live Server.

## Primeiro commit

```bash
git status
git diff
git add .
git commit -m "chore: configura projeto a partir do template"
git push
```

## Checklist inicial

- [ ] o repositório foi criado com **Use this template**;
- [ ] o clone aponta para a conta correta;
- [ ] o nome do pacote foi atualizado;
- [ ] o README apresenta o projeto;
- [ ] a versão do Node.js foi conferida;
- [ ] as dependências foram instaladas;
- [ ] as extensões recomendadas foram instaladas;
- [ ] o servidor de desenvolvimento foi iniciado;
- [ ] format, lint e build foram executados;
- [ ] o primeiro commit foi enviado ao GitHub.
