using Microsoft.EntityFrameworkCore;
using VolkswagenApi.Models;

namespace VolkswagenApi.Data;

public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options)
        : base(options)
    {
    }

    public DbSet<CarroEntity> Carros => Set<CarroEntity>();
}