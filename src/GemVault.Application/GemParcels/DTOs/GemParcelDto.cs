namespace GemVault.Application.GemParcels.DTOs;

public record GemParcelPhotoDto(Guid Id, string Url, bool IsCover, DateTime CreatedAt);

public record GemParcelSoldInfoDto(Guid SaleId, DateTime SaleDate, decimal SalePrice);

public record GemParcelDto(
    Guid Id,
    string Name,
    string? Species,
    string? Variety,
    int Quantity,
    decimal? TotalWeightCarats,
    string? Color,
    string? Treatment,
    decimal? PurchasePrice,
    DateTime? AcquiredAt,
    string? Notes,
    bool IsPublic,
    Guid OwnerId,
    Guid? OriginId,
    string? OriginCountry,
    string? OriginLocality,
    string? PublicToken,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<GemParcelPhotoDto> Photos,
    GemParcelSoldInfoDto? SoldInfo,
    int SplitGemCount,
    Guid? PurchaseOrderId);

public record GemParcelSummaryDto(
    Guid Id,
    string Name,
    string? Species,
    string? Variety,
    int Quantity,
    decimal? TotalWeightCarats,
    string? Color,
    bool IsPublic,
    string? CoverPhotoUrl,
    DateTime CreatedAt,
    bool IsSold);
