var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Disponibiliza a interface em /index.html, junto da API.
app.UseStaticFiles();

//Criar nossa lista
var Volkswagen = new List<CarrosDto>
{
    new CarrosDto(1, "Gol", 75.990),
    new CarrosDto(2, "Voyage" , 85.990),
};


app.MapGet("/", () => "Sistema no ar! Acesse /api/carros/ para ver a lista de carros.");

app.MapGet("/api/carros", () =>
{
    return Results.Ok(Volkswagen);
});

app.MapGet("/api/carros/{id:int}", (int id) =>
{
    var carro = Volkswagen.Find(carroDaLista => carroDaLista.Id == id);

    if (carro is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(carro);
});

app.MapPost("/api/carros", (CarrosEntradaDto dados) =>
{
    int proximoId = Volkswagen.Count + 1;

    var novoCarro = new CarrosDto(proximoId, dados.Nome, 0.0);

    Volkswagen.Add(novoCarro);

    return Results.Created($"/api/carros/{novoCarro.Id}", novoCarro);

});


app.MapPut("/api/carros/{id:int}", (int id, CarrosEntradaDto dados) => 
{
    int indice = Volkswagen.FindIndex(carroDaLista => carroDaLista.Id == id);
    if(indice == -1)
    {
        return Results.NotFound();
    }

    var carroAtualizado = new CarrosDto(id, dados.Nome, 0.0);

    Volkswagen[indice] = carroAtualizado;

    return Results.Ok(carroAtualizado);
});

app.MapDelete("/api/carros/{id:int}", (int id) => 
{
    int indice = Volkswagen.FindIndex(carroDaLista => carroDaLista.Id == id);
    if(indice == -1)
    {
        return Results.NotFound();
    }
    Volkswagen.RemoveAt(indice);
    return Results.NoContent();
});

app.Run();

////tesre
record CarrosDto(int Id, string Nome,double preco);
record CarrosEntradaDto(string Nome);
