using BadmintonShop.Api.Data;
using BadmintonShop.Api.DTOs.Categories;
using BadmintonShop.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BadmintonShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CategoriesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetCategories()
    {
        var categories = await _dbContext.Categories
            .OrderBy(category => category.Name)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _dbContext.Categories.FindAsync(id);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(CreateCategoryRequest request)
    {
        var name = request.Name.Trim();

        var nameExists = await _dbContext.Categories
            .AnyAsync(category => category.Name == name);

        if (nameExists)
        {
            return Conflict("Category name already exists.");
        }

        var category = new Category
        {
            Name = name,
            Description = request.Description?.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryRequest request)
    {
        var category = await _dbContext.Categories.FindAsync(id);

        if (category is null)
        {
            return NotFound();
        }

        var name = request.Name.Trim();

        var nameExists = await _dbContext.Categories
            .AnyAsync(existingCategory => existingCategory.Id != id && existingCategory.Name == name);

        if (nameExists)
        {
            return Conflict("Category name already exists.");
        }

        category.Name = name;
        category.Description = request.Description?.Trim();
        category.IsActive = request.IsActive;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _dbContext.Categories.FindAsync(id);

        if (category is null)
        {
            return NotFound();
        }

        _dbContext.Categories.Remove(category);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}