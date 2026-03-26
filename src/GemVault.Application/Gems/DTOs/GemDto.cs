using GemVault.Application.Certificates;
using GemVault.Application.CuttingSessions;
using GemVault.Application.DesignFiles;
using GemVault.Domain.Enums;

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
    DateTime? AcquiredAt,
    string? Notes,
    bool IsPublic,
    Guid OwnerId,
    Guid? OriginId,
    string? OriginCountry,
    string? OriginLocality,
    string? Attributes,
    GemStatus Status,
    string? PublicToken,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<GemPhotoDto> Photos,
    GemSoldInfoDto? SoldInfo,
    List<CertificateDto> Certificates,
    Guid? SourceParcelId,
    string? SourceParcelName,
    Guid? PurchaseOrderId,
    decimal? RoughWeightCarats,
    string? CutPlanNotes,
    string? CuttingDesign,
    int? PlannedFacets,
    IReadOnlyList<CuttingSessionDto> CuttingSessions,
    IReadOnlyList<DesignFileDto> DesignFiles,
    string? ConsigneeName,
    string? ConsigneeContact,
    decimal? ConsignmentTargetPrice,
    DateOnly? ConsignmentDate,
    DateOnly? ConsignmentReturnDate);

public record GemSummaryDto(
    Guid Id,
    string Name,
    string? Species,
    string? Variety,
    decimal? WeightCarats,
    decimal? RoughWeightCarats,
    string? Color,
    bool IsPublic,
    string? CoverPhotoUrl,
    DateTime CreatedAt,
    bool IsSold,
    GemStatus Status,
    string? CurrentCuttingStage,
    decimal? TotalCuttingHours);
