# FunkoStore

> este site é uma loja que vende funkos pop

Descreva brevemente o objetivo da aplicação, o problema que ela resolve e o
público ao qual se destina.

## Tecnologias

- Vue.js 3;
- Vite;
- Vue Router;
- Bootstrap 5;
- Bootstrap Icons;
- Axios.

## Pré-requisitos

Antes de iniciar, verifique se estão instalados:

- [Node.js](https://nodejs.org/);
- npm;
- [Git](https://git-scm.com/);
- [Visual Studio Code](https://code.visualstudio.com/), recomendado.

O projeto utiliza o Node.js `22.18.0`, definido no arquivo `.nvmrc`.

```bash
node --version
npm --version
git --version
```

Caso utilize NVM no Linux ou macOS:

```bash
nvm install
nvm use
```

No Windows com `nvm-windows`:

```powershell
nvm install 22.18.0
nvm use 22.18.0
```

## Instalação

Clone o repositório:

```bash
git clone URL-DO-REPOSITORIO
```

Acesse o diretório e instale as dependências:

```bash
cd nome-do-projeto
npm install
```

## Execução

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O terminal apresentará o endereço local da aplicação, normalmente:

```text
http://localhost:5173
```

Outros comandos disponíveis:

```bash
npm run format
npm run lint
npm run build
npm run preview
```

## Estrutura do projeto

A aplicação organiza páginas, componentes, serviços, rotas e estilos por
responsabilidade.

Consulte o [guia de estrutura do projeto](./docs/estrutura-projeto.md).

## Documentação

- [Como utilizar o template](./docs/como-utilizar-template.md);
- [Estrutura do projeto](./docs/estrutura-projeto.md);
- [CRUD e endpoints de categorias](./docs/api-categorias.md);
- [Guia de padronização do código](./docs/guia-padronizacao-codigo.md);
- [Validação do projeto](./docs/validacao-template.md).

## Contribuição

Para contribuir:

1. faça um fork, caso não possua acesso direto ao repositório;
2. clone o repositório ou seu fork;
3. crie uma branch para a alteração;
4. desenvolva e teste a funcionalidade;
5. execute a formatação, o lint e o build;
6. crie um commit com uma mensagem descritiva;
7. envie a branch ao GitHub;
8. abra um Pull Request.

```bash
git switch -c feat/nome-da-funcionalidade
npm run format
npm run lint
npm run build
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feat/nome-da-funcionalidade
```

## Origem do template

Este projeto foi iniciado a partir do
[Template Vue.js com Bootstrap](https://github.com/ifc-dev-web2/tec-vue-bootstrap-template),
desenvolvido pelo
[Prof. Cristofer Sousa](https://github.com/cristofersousa) para atividades de
Desenvolvimento Web do Instituto Federal Catarinense — Campus Araquari.

## Licença

Consulte os termos de utilização no arquivo [LICENSE](LICENSE).


## Entidades

<<<<<<< HEAD
 ### 1 Usuário : Armazenar os dados cadastrais dos clientes, permitindo que eles façam login para realizar e visualizar compras, além de atualizar suas próprias informações. 

Campos
Campo	Tipo de dado	Obrigatório
id	Number	Sim
nome	String	Sim
email	String	Sim
senha	String	Sim
telefone	String	Não
dataCadastro	String	Sim


Relacionamentos:
- Um usuário pode possuir vários pedidos.
- Um usuário pode possuir um ou mais endereços.


Endpoints
Método HTTP	Endpoint	Funcionalidade
GET	/usuarios	Listar usuários
GET	/usuarios/:id	Consultar usuário pelo ID
POST	/usuarios	Cadastrar usuário
PUT	/usuarios/:id	Atualizar usuário
DELETE	/usuarios/:id	Excluir usuário


Validações
- Nome obrigatório.
- E-mail obrigatório e com formato válido.
- Não permitir e-mails duplicados.
- Senha com pelo menos 6 caracteres.
- Telefone com formato válido, caso preenchido.
Telas que utilizarão os endpoints
- Cadastro de usuário.
- Listagem de usuários.
- Edição de usuário.
- Exclusão de usuário.


 ### Nome: 2 Funko 

Finalidade: Armazenar todas as informações dos Funkos disponíveis para venda na loja.

Campos
Campo	Tipo de dado	Obrigatório
id	Number	Sim
nome	String	Sim
personagem	String	Sim
descricao	String	Sim
franquia	String	Sim
anoLancamento	Number	Sim
preco	Number	Sim
imagem	String	Sim
referencia	String	Não
estoque	Number	Sim
categoriaId	Number	Sim


Relacionamentos:
- Um Funko pertence a uma categoria.
- Um Funko pode aparecer em vários itens de pedidos.

Endpoints
Método HTTP	Endpoint	Funcionalidade
GET	/funkos	Listar todos os Funkos
GET	/funkos/:id	Consultar Funko pelo ID
POST	/funkos	Cadastrar Funko
PUT	/funkos/:id	Atualizar Funko
DELETE	/funkos/:id	Excluir Funko


Pesquisa de Funkos:
Validações
- Nome obrigatório.
- Personagem obrigatório.
- Descrição obrigatória.
- Preço maior que zero.
- Ano de lançamento válido.
- Estoque não pode ser negativo.
- Categoria obrigatória.
- Imagem obrigatória.
Telas que utilizarão os endpoints
- Página inicial.
- Barra de pesquisa.
- Página de detalhes do Funko.
- Cadastro de Funkos.
- Listagem de Funkos.
- Atualização de Funkos.
- Exclusão de Funkos.


 ### Nome: 3 Categoria 

Finalidade: Organizar os Funkos de acordo com suas franquias ou universos.

Por exemplo:
- Marvel.
- DC Comics.
- Disney.
- Harry Potter.
- Anime.
- Filmes e séries.

Campo	Tipo de dado	Obrigatório
id	Number	Sim
nome	String	Sim
descricao	String	Não


Relacionamentos:
- Uma categoria pode possuir vários Funkos.
- Um Funko pertence a uma categoria.
Exemplo: a categoria Marvel pode possuir Homem-Aranha, Homem de Ferro, Hulk e outros personagens.


Endpoints
Método HTTP	Endpoint	Funcionalidade
GET	/categorias	Listar categorias
GET	/categorias/:id	Consultar categoria
POST	/categorias	Cadastrar categoria
PUT	/categorias/:id	Atualizar categoria
DELETE	/categorias/:id	Excluir categoria


Validações
- Nome obrigatório.
- Não permitir categorias duplicadas.
- Não permitir excluir uma categoria que ainda possua Funkos vinculados, sem antes tratar esses vínculos.
Telas que utilizarão os endpoints
- Cadastro de Funko.
- Página inicial.
- Filtros de categorias.
- Gerenciamento de categorias.


### Nome: 4 Pedido 

Finalidade: Registrar as compras realizadas pelos usuários.

Campo	Tipo de dado	Obrigatório
id	Number	Sim
usuarioId	Number	Sim
dataPedido	String	Sim
valorTotal	Number	Sim
status	String	Sim
enderecoId	Number	Sim


Relacionamentos:
- Um usuário pode realizar vários pedidos.
- Um pedido pertence a um usuário.
- Um pedido possui um endereço de entrega.
- Um pedido possui um ou vários itens.


Endpoints
Método HTTP	Endpoint	Funcionalidade
GET	/pedidos	Listar pedidos
GET	/pedidos/:id	Consultar pedido
POST	/pedidos	Cadastrar pedido
PUT	/pedidos/:id	Atualizar pedido
DELETE	/pedidos/:id	Excluir pedido


Validações
- Usuário obrigatório.
- Endereço obrigatório.
- Valor total maior que zero.
- Status deve corresponder às opções disponíveis.
- Data do pedido obrigatória.
Telas que utilizarão os endpoints
- Finalização da compra.
- Histórico de pedidos.
- Detalhes do pedido.
- Gerenciamento de pedidos.


### Nome: 5 ItemPedido 

Finalidade: Registrar quais Funkos foram comprados em cada pedido, incluindo a quantidade e o preço de cada produto.

Campo	Tipo de dado	Obrigatório
id	Number	Sim
pedidoId	Number	Sim
funkoId	Number	Sim
quantidade	Number	Sim
precoUnitario	Number	Sim


Relacionamentos:
- Um pedido possui vários itens.
- Um item pertence a um pedido.
- Um item está relacionado a um Funko.


Endpoints
Método HTTP	Endpoint	Funcionalidade
GET	/itensPedido	Listar itens
GET	/itensPedido/:id	Consultar item
POST	/itensPedido	Cadastrar item
PUT	/itensPedido/:id	Atualizar item
DELETE	/itensPedido/:id	Excluir item


Validações
- Pedido obrigatório.
- Funko obrigatório.
- Quantidade maior que zero.
- Preço unitário maior que zero.
- Verificar se existe estoque disponível.
Telas que utilizarão os endpoints
- Carrinho de compras.
- Finalização do pedido.
- Detalhes do pedido.


 ### Nome: 6 Carrinho 

Finalidade: Armazenar os Funkos que o usuário deseja comprar antes de finalizar o pedido.

Campo	Tipo de dado	Obrigatório
id	Number	Sim
usuarioId	Number	Sim
funkoId	Number	Sim
quantidade	Number	Sim
dataAdicao	String	Sim


Relacionamentos
- Um usuário pode possuir vários itens no carrinho.
- Um Funko pode estar presente em vários carrinhos.
- Cada registro do carrinho pertence a um usuário e está relacionado a um Funko.


Endpoints
Método HTTP	Endpoint	Funcionalidade
GET	/carrinhos	Listar itens dos carrinhos
GET	/carrinhos/:id	Consultar item pelo ID
POST	/carrinhos	Adicionar Funko ao carrinho
PUT	/carrinhos/:id	Atualizar quantidade
DELETE	/carrinhos/:id	Remover Funko do carrinho


Validações previstas
- Usuário obrigatório.
- Funko obrigatório.
- Quantidade maior que zero.
- Verificar se o Funko existe.
- Verificar se existe estoque suficiente.
- Não permitir adicionar produtos indisponíveis.
Telas que utilizarão os endpoints
1. Carrinho de compras: exibir os Funkos adicionados.
2. Adicionar ao carrinho: permitir adicionar um Funko.
3. Atualizar quantidade: permitir aumentar ou diminuir a quantidade.
4. Remover do carrinho: excluir um produto do carrinho.
5. Finalizar compra: encaminhar os produtos para a criação de um pedido.




=======
Usuário: (Mariano)Armazenar os dados cadastrais dos clientes, permitindo que eles façam login para realizar e visualizar compras, além de atualizar suas próprias informações. 

Pedido_Funko: (feliciano) Registrar os Funko Pops específicos que foram comprados por um usuário, permitindo a listagem por ID e o cancelamento/exclusão da compra.

estoque: (Renato) sistema onde vai ficar estocados os produtos do site

comentario:(comentario): sistema de criar comentarios em produdos e pedidos, para o cliente dar sua opinião

pagamento:(carol): sistema de pagamento uma finalização da compra

Categorias: (Marco): categorai onde vai estar dividido os produtos 
>>>>>>> ddf3c10 (alterado o readme)

