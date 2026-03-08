namespace GemVault.Application.Gems.DTOs;

public record GemPhotoDto(
    Guid Id,
    string Url,
    bool IsCover,
    DateTime CreatedAt);

/// <summary>Populated when the gem has been linked to a sale.</summary>
public record GemSoldInfoDto(Guid SaleId, DateTime SaleDate, decimal SalePrice);

public record GemDto(
    Guid Id,
    string Name,
    string? Species,
    string? Variety,
    decimal? WeightCarats,
    string? Color,
    string? Clarity,
    string? Cut,
    string? Treatment,
    string? Shape,
    decimal? LengthMm,
    decimal? WidthMm,
    decimal? HeightMm,
    decimal? PurchasePrice,
    string? Notes,
    bool IsPublic,
    Guid OwnerId,
    Guid? OriginId,
    string? OriginCountry,
    string? Attributes,
    string? PublicToken,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<GemPhotoDto> Photos,
    GemSoldInfoDto? SoldInfo);

public record GemSummaryDto(
    Guid Id,
    string Name,
    string? Species,
    string? Variety,
    decimal? WeightCarats,
    string? Color,
    bool IsPublic,
    string? CoverPhotoUrl,
    DateTime CreatedAt,
    bool IsSold);
