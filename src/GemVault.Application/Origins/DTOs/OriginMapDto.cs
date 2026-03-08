namespace GemVault.Application.Origins.DTOs;

public record OriginMapDto(
    Guid Id,
    string Country,
    string? Mine,
    string? Region,
    int GemCount,
    int ParcelCount,
    decimal TotalCarats,
    decimal TotalInvested,
    List<string> Species,
    DateTime CreatedAt);
