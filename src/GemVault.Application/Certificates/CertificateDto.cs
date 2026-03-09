namespace GemVault.Application.Certificates;

public record CertificateDto(
    Guid Id,
    string CertNumber,
    string? Lab,
    string? Grade,
    DateTime? IssueDate,
    string? FileUrl,
    Guid? GemId,
    DateTime CreatedAt);
