using BadmintonShop.Api.Data;
using BadmintonShop.Api.DTOs.Products;
using BadmintonShop.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BadmintonShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public ProductsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts()
    {
        var products = await _dbContext
            .Products.Include(product => product.Brand)
            .Include(product => product.Category)
            .Include(product => product.Variants)
            .OrderBy(product => product.Name)
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _dbContext
            .Products.Include(product => product.Brand)
            .Include(product => product.Category)
            .Include(product => product.Variants)
            .FirstOrDefaultAsync(product => product.Id == id);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(CreateProductRequest request)
    {
        var brandExists = await _dbContext.Brands.AnyAsync(brand => brand.Id == request.BrandId);

        if (!brandExists)
        {
            return BadRequest("Brand does not exist.");
        }

        var categoryExists = await _dbContext.Categories.AnyAsync(category =>
            category.Id == request.CategoryId
        );

        if (!categoryExists)
        {
            return BadRequest("Category does not exist.");
        }

        var name = request.Name.Trim();

        var productNameExists = await _dbContext.Products.AnyAsync(product =>
            product.BrandId == request.BrandId && product.Name == name
        );

        if (productNameExists)
        {
            return Conflict("Product name already exists for this brand.");
        }

        var skus = request.Variants.Select(variant => variant.Sku.Trim()).ToList();

        var hasDuplicateSkuInRequest = skus.Count != skus.Distinct().Count();

        if (hasDuplicateSkuInRequest)
        {
            return BadRequest("Duplicate SKU in request.");
        }

        var existingSku = await _dbContext
            .ProductVariants.Where(variant => skus.Contains(variant.Sku))
            .Select(variant => variant.Sku)
            .FirstOrDefaultAsync();

        if (existingSku is not null)
        {
            return Conflict($"SKU already exists: {existingSku}");
        }

        var product = new Product
        {
            Name = name,
            Description = request.Description?.Trim(),
            BrandId = request.BrandId,
            CategoryId = request.CategoryId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Variants = request
                .Variants.Select(variant => new ProductVariant
                {
                    Sku = variant.Sku.Trim(),
                    Price = variant.Price,
                    StockQuantity = variant.StockQuantity,
                    Weight = variant.Weight?.Trim(),
                    GripSize = variant.GripSize?.Trim(),
                    ShoeSize = variant.ShoeSize?.Trim(),
                    Color = variant.Color?.Trim(),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                })
                .ToList(),
        };

        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }
}
