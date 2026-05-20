namespace BadmintonShop.Api.DTOs.Brands;

public class CreateBrandRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}