# Volkswagen — API com interface

Interface acadêmica independente inspirada na Volkswagen, adaptada ao Program.cs enviado. HTML, CSS e JavaScript puros, sem dependências de frontend e sem imagens externas.

## Executar

1. Instale o SDK do .NET 10, caso ainda não esteja instalado.
2. Extraia o ZIP e abra a pasta volkswagen-api no VS Code.
3. No terminal dessa pasta, execute:

```bash
dotnet run --urls http://localhost:5220
```

4. Abra no navegador:

http://localhost:5220/index.html

Mantenha o terminal rodando. Não abra o HTML com duplo clique ou Live Server: ele usa a API na mesma origem.

O nome ApiBiblioteca.csproj foi mantido para compatibilidade com o arquivo enviado, mas o projeto gerencia carros.

## Arquivos

- Program.cs: sua API, com a adição de `app.UseStaticFiles();` após `builder.Build()` para servir os arquivos em wwwroot.
- wwwroot/index.html: estrutura da interface.
- wwwroot/styles.css: visual e adaptações para telas menores.
- wwwroot/app.js: chamadas à API e interações.

Para aproveitar no seu projeto existente, copie a pasta wwwroot para a raiz e adicione `app.UseStaticFiles();` após `var app = builder.Build();` no Program.cs. As rotas existentes continuam iguais, incluindo a mensagem em `/`.

## Funções e rotas

| Função | Requisição |
| --- | --- |
| Listar e atualizar estoque | GET /api/carros |
| Consultar ID e abrir detalhes | GET /api/carros/{id} |
| Cadastrar | POST /api/carros |
| Editar | PUT /api/carros/{id} |
| Excluir, após confirmação | DELETE /api/carros/{id} |

A pesquisa por nome e a ordenação são feitas no navegador sobre a lista carregada.

POST e PUT enviam exatamente:

```json
{ "nome": "Golf" }
```

A resposta de um carro contém `id`, `nome` e `preco`. A interface apresenta o preço recebido sem multiplicar nem corrigir o valor silenciosamente.

## Comportamentos do backend original

A lógica da sua API foi preservada. Observe estes pontos antes de apresentar:

1. Em C#, `75.990` significa 75,99, e não 75.990 reais. Se a intenção era setenta e cinco mil novecentos e noventa reais, altere para `75990.0`. Para o Voyage, use `85990.0` se essa era a intenção.
2. CarrosEntradaDto aceita apenas Nome. POST e PUT atribuem preço 0.0, inclusive quando você edita um carro que já tinha preço. Por isso a interface só permite informar o nome e avisa sobre o preço antes de salvar.
3. O ID é calculado com `Volkswagen.Count + 1`. Após exclusões, esse cálculo pode gerar IDs repetidos. Exemplo: excluir o ID 1 de uma lista com IDs 1 e 2 e depois cadastrar resulta em outro ID 2. Corrija a geração de IDs no backend antes de usar esse fluxo em uma apresentação completa. Um contador crescente inicializado fora da rota é uma alternativa simples para este exercício.
4. Os dados ficam em memória e são restaurados ao reiniciar o servidor. A lista não é um banco de dados nem uma implementação apropriada para acessos concorrentes em produção.
5. O README antigo descrevia livros; este documento descreve as rotas reais do Program.cs enviado.

## Validação realizada

- Sintaxe do JavaScript validada com `node --check`.
- Chamadas do frontend conferidas contra as rotas e DTOs enviados.
- .NET SDK indisponível no ambiente de criação: compilação e teste integrado precisam ser realizados no seu computador.

## Roteiro rápido de conferência

1. Inicie a API e abra /index.html: Gol e Voyage devem aparecer.
2. Busque Gol por nome e consulte o ID 1.
3. Cadastre Golf: ele deve aparecer com preço zero.
4. Edite Golf: o nome deve mudar.
5. Exclua Golf pela confirmação da interface.
6. Consulte um ID inexistente para conferir a mensagem de erro.
7. Pare o servidor e clique em Atualizar lista para conferir o aviso de conexão.



