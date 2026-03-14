using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Admin.Commands;

public record AdminDeleteCertificateCommand(Guid CertificateId) : IRequest;

public class AdminDeleteCertificateCommandHandler(
    IApplicationDbContext context,
    IStorageService storage)
    : IRequestHandler<AdminDeleteCertificateCommand>
{
    public async Task Handle(AdminDeleteCertificateCommand request, CancellationToken ct)
    {
        var cert = await context.Certificates
            .FirstOrDefaultAsync(c => c.Id == request.CertificateId && !c.IsDeleted, ct)
            ?? throw new NotFoundException("Certificate", request.CertificateId);

        if (!string.IsNullOrEmpty(cert.ObjectKey))
            await storage.DeleteAsync(cert.ObjectKey, ct);

        cert.IsDeleted = true;
        await context.SaveChangesAsync(ct);
    }
}
