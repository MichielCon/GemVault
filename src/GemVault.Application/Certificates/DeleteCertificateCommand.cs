using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Certificates;

public record DeleteCertificateCommand(Guid CertificateId) : IRequest;

public class DeleteCertificateCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<DeleteCertificateCommand>
{
    public async Task Handle(DeleteCertificateCommand request, CancellationToken ct)
    {
        var certificate = await context.Certificates
            .FirstOrDefaultAsync(c => c.Id == request.CertificateId && !c.IsDeleted, ct)
            ?? throw new NotFoundException("Certificate", request.CertificateId);

        // Verify gem ownership
        var gem = await context.Gems
            .FirstOrDefaultAsync(g => g.Id == certificate.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", certificate.GemId ?? Guid.Empty);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        // Remove the file from MinIO storage
        if (!string.IsNullOrEmpty(certificate.ObjectKey))
        {
            await storage.DeleteAsync(certificate.ObjectKey, ct);
        }

        // Soft delete
        certificate.IsDeleted = true;
        await context.SaveChangesAsync(ct);
    }
}
