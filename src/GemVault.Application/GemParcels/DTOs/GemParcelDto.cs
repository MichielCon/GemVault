namespace GemVault.Application.GemParcels.DTOs;

public record GemParcelPhotoDto(Guid Id, string Url, bool IsCover, DateTime CreatedAt);

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
    string? Notes,
    bool IsPublic,
    Guid OwnerId,
    Guid? OriginId,
    string? OriginCountry,
    string? PublicToken,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<GemParcelPhotoDto> Photos);

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
    DateTime CreatedAt);
