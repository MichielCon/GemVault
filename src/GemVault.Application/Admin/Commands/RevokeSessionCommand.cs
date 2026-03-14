using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Admin.Commands;

public record RevokeSessionCommand(Guid SessionId) : IRequest;

public class RevokeSessionCommandHandler(IApplicationDbContext context)
    : IRequestHandler<RevokeSessionCommand>
{
    public async Task Handle(RevokeSessionCommand request, CancellationToken ct)
    {
        var token = await context.RefreshTokens
            .FirstOrDefaultAsync(t => t.Id == request.SessionId && !t.IsDeleted, ct);

        if (token is null)
            throw new NotFoundException("RefreshToken", request.SessionId);

        token.IsRevoked = true;
        await context.SaveChangesAsync(ct);
    }
}
