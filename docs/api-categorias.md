# CRUD de categorias

As categorias organizam os Funkos por franquia ou universo. Cada registro possui
`id` (gerado pela API), `nome` (obrigatório e único) e `descricao` (opcional).

## Iniciar a API

Em um terminal, execute:

```bash
npm run server
```

O JSON Server fica disponível em `http://localhost:3000`. Em outro terminal,
inicie a aplicação com `npm run dev`. Para apontar a aplicação a outra API,
configure a variável `VITE_API_URL`.

## Endpoints

| Método | Endpoint | Funcionalidade |
| --- | --- | --- |
| GET | `/categorias` | Lista as categorias |
| GET | `/categorias/:id` | Consulta uma categoria |
| POST | `/categorias` | Cadastra uma categoria |
| PUT | `/categorias/:id` | Atualiza uma categoria |
| DELETE | `/categorias/:id` | Exclui uma categoria |

O gerenciamento também está disponível na tela `/categorias`. A interface
impede nomes duplicados e bloqueia a exclusão de categorias que ainda possuem
Funkos vinculados. O JSON Server não aplica essa validação em chamadas diretas:
antes de excluir por HTTP, consulte `/produtos?categoriaId=:id` e confirme que
nenhum Funko está associado.

## Exemplos HTTP

```bash
curl http://localhost:3000/categorias
curl http://localhost:3000/categorias/1
curl -X POST http://localhost:3000/categorias -H "Content-Type: application/json" -d "{\"nome\":\"Marvel\",\"descricao\":\"Heróis da Marvel\"}"
curl -X PUT http://localhost:3000/categorias/1 -H "Content-Type: application/json" -d "{\"nome\":\"Marvel Comics\",\"descricao\":\"Heróis e personagens da Marvel\"}"
curl -X DELETE http://localhost:3000/categorias/ID_SEM_PRODUTOS
```
