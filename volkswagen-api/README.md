# Volkswagen API — Avaliação Semestral (AS)

Projeto acadêmico desenvolvido na disciplina de Desenvolvimento Back-End.

## Objetivo

API REST para gerenciamento de veículos Volkswagen, permitindo cadastrar, consultar, atualizar e excluir veículos, com persistência em banco de dados e interface web integrada.

## Tecnologias utilizadas

- C#
- ASP.NET Core — .NET 10
- Entity Framework Core
- SQLite
- HTML, CSS e JavaScript
- Bruno
- Git e GitHub

## Melhorias implementadas na AS

- Persistência dos dados com SQLite.
- Operações CRUD assíncronas.
- Geração automática de IDs.
- Organização em Models, Dtos e Data.
- Utilização de namespaces.
- Cadastro e atualização de preços.
- Middleware de tratamento de exceções.
- Interface web integrada ao banco de dados por meio da API.

## Como executar

Entre na pasta `volkswagen-api` e execute:

```powershell
dotnet restore
dotnet ef database update
dotnet run --no-launch-profile --urls http://localhost:5050
```

Interface web: http://localhost:5050/index.html

## Endpoints

| Método | Rota | Função |
|---|---|---|
| GET | /api/carros | Listar veículos |
| GET | /api/carros/{id} | Consultar veículo |
| POST | /api/carros | Cadastrar veículo |
| PUT | /api/carros/{id} | Atualizar veículo |
| DELETE | /api/carros/{id} | Excluir veículo |

## Exemplo de cadastro

```json
{
    "nome": "Volkswagen Jetta",
    "preco": 149990.00
}
```

## Testes

A coleção de requisições está disponível na pasta `bruno/`.

O tratamento de exceções retorna HTTP 500 com uma mensagem genérica, sem expor informações internas. Consultas de IDs inexistentes retornam HTTP 404.

## Vídeo demonstrativo

parte-1: https://www.youtube.com/watch?v=ARG1VyMX0xw
parte-2: https://www.youtube.com/watch?v=VCxkJ0KiAOU

## Finalidade

Projeto exclusivamente acadêmico, sem vínculo oficial com a Volkswagen.