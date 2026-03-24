namespace GemVault.Application.Public.DTOs;

public record PublicPhotoDto(Guid Id, string Url, bool IsCover);

/// <summary>
/// Public-safe view of a gem or parcel. Never exposes PurchasePrice, OwnerId,
/// supplier data, or any financial information.
/// </summary>
public record PublicGemDto(
    Guid Id,
    string RecordType,   // "Gem" or "Parcel"
    string Name,
    string? Species,
    string? Variety,
    string? Color,
    string? Treatment,
    string? Shape,             // Gem only (null for parcels)
    string? Clarity,           // Gem only (null for parcels)
    string? Cut,               // Gem only (null for parcels)
    decimal? WeightCarats,     // Gem only (null for parcels)
    decimal? TotalWeightCarats, // Parcel only (null for gems)
    int? Quantity,             // Parcel only (null for gems)
    string? Notes,
    string? OriginCountry,
    string? OriginLocality,
    DateTime CreatedAt,
    List<PublicPhotoDto> Photos,
    int ScanCount);
