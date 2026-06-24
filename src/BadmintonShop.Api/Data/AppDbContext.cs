using BadmintonShop.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BadmintonShop.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Brand> Brands => Set<Brand>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Product> Products => Set<Product>();

    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Brand>().HasIndex(brand => brand.Name).IsUnique();

        modelBuilder.Entity<Category>().HasIndex(category => category.Name).IsUnique();

        modelBuilder
            .Entity<Product>()
            .HasIndex(product => new { product.BrandId, product.Name })
            .IsUnique();

        modelBuilder.Entity<ProductVariant>().HasIndex(variant => variant.Sku).IsUnique();

        modelBuilder
            .Entity<ProductVariant>()
            .Property(variant => variant.Price)
            .HasPrecision(18, 2);
    }
}
