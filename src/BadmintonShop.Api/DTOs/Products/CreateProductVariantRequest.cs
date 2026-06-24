using System.ComponentModel.DataAnnotations;

namespace BadmintonShop.Api.DTOs.Products;

public class CreateProductVariantRequest
{
    [Required]
    [MaxLength(100)]
    public string Sku { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    [MaxLength(20)]
    public string? Weight { get; set; }

    [MaxLength(20)]
    public string? GripSize { get; set; }

    [MaxLength(20)]
    public string? ShoeSize { get; set; }

    [MaxLength(50)]
    public string? Color { get; set; }
}
