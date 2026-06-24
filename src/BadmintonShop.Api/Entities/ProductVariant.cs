using System.Text.Json.Serialization;

namespace BadmintonShop.Api.Entities;

public class ProductVariant
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    [JsonIgnore]
    public Product Product { get; set; } = null!;

    public string Sku { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public string? Weight { get; set; }

    public string? GripSize { get; set; }

    public string? ShoeSize { get; set; }

    public string? Color { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
