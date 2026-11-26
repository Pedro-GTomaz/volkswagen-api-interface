using Microsoft.EntityFrameworkCore;
using VolkswagenApi.Models;
using VolkswagenApi.Dtos;
using VolkswagenApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            mensagem = "Ocorreu um erro interno. Tente novamente mais tarde."
        });
    });
});

// Disponibiliza a interface em /index.html, junto da API.
app.UseStaticFiles();

app.MapGet("/", () => "Sistema no ar! Acesse /api/carros/ para ver a lista de carros.");

app.MapGet("/api/carros", async (ApiDbContext db) =>
    await db.Carros.ToListAsync());

app.MapGet("/api/carros/{id:int}", async (int id, ApiDbContext db) =>
{
    var carro = await db.Carros.FindAsync(id);

    if (carro is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(carro);
});

app.MapPost("/api/carros", async (CarrosEntradaDto dados, ApiDbContext db) =>
{
    var carro = new CarroEntity
    {
        Nome = dados.Nome,
        Preco = dados.Preco
    };

    db.Carros.Add(carro);

    await db.SaveChangesAsync();

    return Results.Created($"/api/carros/{carro.Id}", carro);
});


app.MapPut("/api/carros/{id:int}", async  (int id, CarrosEntradaDto dados, ApiDbContext db) => 
{
    var carro = await db.Carros.FindAsync(id);
    if(carro is null)
    {
        return Results.NotFound();
    }

    carro.Nome = dados.Nome;
    carro.Preco = dados.Preco;
    await db.SaveChangesAsync();

    return Results.Ok(carro);
});

app.MapDelete("/api/carros/{id:int}", async (int id, ApiDbContext db) =>
{
    var carro = await db.Carros.FindAsync(id);

    if (carro is null)
    {
        return Results.NotFound();
    }

    db.Carros.Remove(carro);

    await db.SaveChangesAsync();

    return Results.NoContent();
});


app.Run();

