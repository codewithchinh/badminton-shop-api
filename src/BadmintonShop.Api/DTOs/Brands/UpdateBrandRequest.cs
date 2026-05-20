namespace BadmintonShop.Api.DTOs.Brands;

public class UpdateBrandRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsActive { get; set; }
}