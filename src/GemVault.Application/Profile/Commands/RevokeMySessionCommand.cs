using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Profile.Commands;

public record RevokeMySessionCommand(Guid SessionId) : IRequest;

public class RevokeMySessionCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<RevokeMySessionCommand>
{
    public async Task Handle(RevokeMySessionCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var token = await context.RefreshTokens
            .FirstOrDefaultAsync(t => t.Id == request.SessionId && !t.IsDeleted, ct)
            ?? throw new NotFoundException("Session", request.SessionId);

        if (token.UserId != currentUser.UserId.Value)
            throw new ForbiddenException();

        token.IsRevoked = true;
        await context.SaveChangesAsync(ct);
    }
}
