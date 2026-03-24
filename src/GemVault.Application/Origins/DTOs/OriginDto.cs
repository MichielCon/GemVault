namespace GemVault.Application.Origins.DTOs;

public record OriginDto(Guid Id, string Country, string? Locality, DateTime CreatedAt, int GemCount = 0, int ParcelCount = 0);
