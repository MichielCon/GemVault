namespace GemVault.Application.DesignFiles;

public record DesignFileDto(
    Guid Id,
    string FileName,
    string FileUrl,
    string? ContentType,
    long FileSize,
    DateTime CreatedAt);
