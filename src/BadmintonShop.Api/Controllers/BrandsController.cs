using BadmintonShop.Api.Data;
using BadmintonShop.Api.DTOs.Brands;
using BadmintonShop.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BadmintonShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public BrandsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<Brand>>> GetBrands()
    {
        var brands = await _dbContext.Brands
            .OrderBy(brand => brand.Name)
            .ToListAsync();

        return Ok(brands);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Brand>> GetBrand(int id)
    {
        var brand = await _dbContext.Brands.FindAsync(id);

        if (brand is null)
        {
            return NotFound();
        }

        return Ok(brand);
    }

    [HttpPost]
    public async Task<ActionResult<Brand>> CreateBrand(CreateBrandRequest request)
    {
        var brand = new Brand
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Brands.Add(brand);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBrand), new { id = brand.Id }, brand);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBrand(int id, UpdateBrandRequest request)
    {
        var brand = await _dbContext.Brands.FindAsync(id);

        if (brand is null)
        {
            return NotFound();
        }

        brand.Name = request.Name.Trim();
        brand.Description = request.Description?.Trim();
        brand.IsActive = request.IsActive;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBrand(int id)
    {
        var brand = await _dbContext.Brands.FindAsync(id);

        if (brand is null)
        {
            return NotFound();
        }

        _dbContext.Brands.Remove(brand);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}