namespace GemVault.Application.Admin.DTOs;

public record AdminCertificateDto(
    Guid Id,
    string CertNumber,
    string? Lab,
    string? Grade,
    DateTime? IssueDate,
    string? FileUrl,
    Guid GemId,
    string GemName,
    Guid OwnerId,
    string OwnerEmail,
    DateTime CreatedAt);
