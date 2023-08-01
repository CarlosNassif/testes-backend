
# Sistema backend para gestão de usuários


## Descrição

Como parte do trabalho final da disciplina, deve-se criar uma API Backend para gestão de usuários do nosso sistema final.

### Requisitos

1. Sistema deve ser escrito em NodeJS
2. Deve conter testes unitários
3. Deve conter testes de sistema
4. Cada usuário deve conter os seguintes atributos: 
    - _id
    - name
    - email
    - password

### Contrato da API

| Path | Descrição | Cenários de Teste|
|---|---|---|
|**GET** /users | Listar todos os usuários| Status Code = 200 (OK) |
|**POST** /users | Criar um novo usuário | Status Code = 201 (Created)
|**GET** /users/:id | Detalhar um usuário | Status Code = 200 (OK) <br/> Status Code = 404 (Not Found) |
|**PUT** /users/:id | Detalhar um usuário | Status Code = 200 (OK) <br/> Status Code = 404 (Not Found) |
|**DELETE** /users/:id | Detalhar um usuário | Status Code = 204 (No Content) <br/> Status Code = 404 (Not Found) |
