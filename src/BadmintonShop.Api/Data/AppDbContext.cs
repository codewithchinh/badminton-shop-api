using BadmintonShop.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BadmintonShop.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Brand> Brands => Set<Brand>();
}