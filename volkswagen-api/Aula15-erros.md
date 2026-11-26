# Aula 15 — Erros, exceções e middleware

## 1. Por que um ID inexistente não deve virar exceção?

Porque a ausência de um registro é uma situação prevista pela API. O retorno adequado é HTTP 404 Not Found, e não HTTP 500.

## 2. Que informação não deve ser devolvida na mensagem pública?

Mensagens técnicas da exceção, stack trace, caminhos internos de arquivos e detalhes da implementação.

## 3. Onde o middleware foi colocado?

Imediatamente após `builder.Build()`, antes dos arquivos estáticos e dos endpoints.

## Resultados dos testes

- Antes do middleware: HTTP 500 com exposição de detalhes técnicos.
- Depois do middleware: HTTP 500 com mensagem genérica em JSON.
- Consulta normal: HTTP 200.
- Consulta de ID inexistente: HTTP 404.