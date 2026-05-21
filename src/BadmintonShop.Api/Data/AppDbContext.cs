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

    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Brand>()
        .HasIndex(brand => brand.Name)
        .IsUnique();

    modelBuilder.Entity<Category>()
        .HasIndex(category => category.Name)
        .IsUnique();
}

}