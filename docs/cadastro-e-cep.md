# Cadastro de usuário e consulta de CEP

## Cadastro

A tela `/usuario/add` permite cadastrar nome, e-mail e telefone opcional pelo
endpoint `POST /usuarios`. O e-mail é validado e comparado com os cadastros
existentes antes da criação. A API atual é um JSON Server e não oferece
autenticação; por isso, o cadastro não solicita nem armazena senhas.

## Consulta de CEP

No checkout, informe um CEP com oito números e saia do campo ou selecione
**Buscar CEP**. O formulário consulta
[`https://viacep.com.br/ws/{CEP}/json/`](https://viacep.com.br/) e preenche
logradouro, bairro, cidade e estado. O número e o complemento continuam sendo
informados pelo cliente. CEP inválido, não encontrado e falhas de conexão são
apresentados no formulário; o endereço ainda pode ser preenchido manualmente.
