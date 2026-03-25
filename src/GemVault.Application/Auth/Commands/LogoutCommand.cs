using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using static GemVault.Application.Auth.Commands.RegisterCommandHandler;

namespace GemVault.Application.Auth.Commands;

public record LogoutCommand(string RefreshToken) : IRequest;

public class LogoutCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    : IRequestHandler<LogoutCommand>
{
    public async Task Handle(LogoutCommand request, CancellationToken ct)
    {
        var tokenHash = HashToken(request.RefreshToken);
        var stored = await context.RefreshTokens
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash && !t.IsRevoked && !t.IsDeleted, ct);

        if (stored is null)
            return;

        // Ownership check: silently ignore if the token belongs to a different user.
        if (currentUser.UserId.HasValue && stored.UserId != currentUser.UserId.Value)
            return;

        stored.IsRevoked = true;
        stored.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
    }
}
