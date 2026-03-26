namespace GemVault.Application.CuttingSessions;

public record CuttingSessionDto(
    Guid Id,
    DateTime SessionDate,
    string Stage,
    decimal? HoursSpent,
    string? Notes,
    DateTime CreatedAt);
