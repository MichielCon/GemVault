namespace GemVault.Application.Admin.DTOs;

public record AdminStatsDto(
    int TotalUsers,
    int AdminCount,
    int BusinessCount,
    int CollectorCount,
    int ActiveUsers,
    int DeletedUsers,
    int NewUsersThisMonth,
    int TotalGems,
    int TotalParcels,
    int TotalPhotos,
    int TotalCertificates,
    int TotalPublicTokens,
    int ActivePublicTokens,
    List<RecentUserDto> RecentUsers);

public record RecentUserDto(Guid Id, string Email, string Role, DateTime CreatedAt);
