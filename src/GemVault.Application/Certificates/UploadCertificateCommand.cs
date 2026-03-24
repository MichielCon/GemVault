using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Certificates;

public record UploadCertificateCommand(
    Guid GemId,
    string CertNumber,
    string? Lab,
    string? Grade,
    DateTime? IssueDate,
    Stream FileStream,
    string FileName,
    string ContentType,
    long FileSize) : IRequest<CertificateDto>;

public class UploadCertificateCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<UploadCertificateCommand, CertificateDto>
{
    public async Task<CertificateDto> Handle(UploadCertificateCommand request, CancellationToken ct)
    {
        // Validate inputs
        if (string.IsNullOrWhiteSpace(request.CertNumber))
            throw new Application.Common.Exceptions.ValidationException("Certificate number is required.");

        if (request.CertNumber.Length > 100)
            throw new Application.Common.Exceptions.ValidationException("Certificate number must not exceed 100 characters.");

        if (request.Lab?.Length > 100)
            throw new Application.Common.Exceptions.ValidationException("Lab name must not exceed 100 characters.");

        if (request.Grade?.Length > 50)
            throw new Application.Common.Exceptions.ValidationException("Grade must not exceed 50 characters.");

        if (!string.Equals(request.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase))
            throw new Application.Common.Exceptions.ValidationException("Only PDF files are allowed for certificates.");

        if (request.FileSize > 20 * 1024 * 1024)
            throw new Application.Common.Exceptions.ValidationException("File size must not exceed 20 MB.");

        // Magic byte validation: %PDF = 0x25 0x50 0x44 0x46
        var header = new byte[4];
        var bytesRead = await request.FileStream.ReadAsync(header.AsMemory(0, 4), ct);
        request.FileStream.Seek(0, System.IO.SeekOrigin.Begin);
        if (bytesRead < 4 || header[0] != 0x25 || header[1] != 0x50 || header[2] != 0x44 || header[3] != 0x46)
            throw new Application.Common.Exceptions.ValidationException("File does not appear to be a valid PDF.");

        // Load and authorise gem
        var gem = await context.Gems
            .FirstOrDefaultAsync(g => g.Id == request.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", request.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        // Upload to MinIO
        var certId = Guid.NewGuid();
        var objectKey = $"certificates/{request.GemId}/{certId}.pdf";

        await storage.UploadAsync(objectKey, request.FileStream, request.ContentType, request.FileSize, ct);

        // Persist entity
        var certificate = new Certificate
        {
            Id = certId,
            GemId = gem.Id,
            CertNumber = request.CertNumber,
            Lab = request.Lab,
            Grade = request.Grade,
            IssueDate = request.IssueDate.HasValue
                ? DateTime.SpecifyKind(request.IssueDate.Value, DateTimeKind.Utc)
                : null,
            ObjectKey = objectKey,
        };

        context.Certificates.Add(certificate);
        await context.SaveChangesAsync(ct);

        var fileUrl = storage.GetPublicUrl(objectKey);

        return new CertificateDto(
            certificate.Id,
            certificate.CertNumber,
            certificate.Lab,
            certificate.Grade,
            certificate.IssueDate,
            fileUrl,
            certificate.GemId,
            certificate.CreatedAt);
    }
}
