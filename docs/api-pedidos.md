# Pedidos

A aplicação utiliza os endpoints REST do JSON Server para registrar e gerenciar
pedidos. Inicie a API com `npm run server` antes de finalizar uma compra.

## Endpoints

| Método | Endpoint       | Uso                  |
| ------ | -------------- | -------------------- |
| GET    | `/pedidos`     | Listar pedidos       |
| GET    | `/pedidos/:id` | Consultar um pedido  |
| POST   | `/pedidos`     | Registrar uma compra |
| PATCH  | `/pedidos/:id` | Atualizar o status   |
| DELETE | `/pedidos/:id` | Excluir um pedido    |

O cadastro exige os dados do cliente, endereço de entrega, data, valor total
maior que zero, ao menos um item e um status válido. Os dados dos produtos são
salvos como cópia no pedido para preservar o histórico mesmo que o cadastro do
produto mude depois.

Os status disponíveis são `Pendente`, `Confirmado`, `Enviado`, `Entregue` e
`Cancelado`. A escolha de forma de pagamento é registrada para referência; o
projeto não processa pagamentos.
