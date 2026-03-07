using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using static GemVault.Application.Auth.Commands.RegisterCommandHandler;

namespace GemVault.Application.Auth.Commands;

public record LogoutCommand(string RefreshToken) : IRequest;

public class LogoutCommandHandler(IApplicationDbContext context)
    : IRequestHandler<LogoutCommand>
{
    public async Task Handle(LogoutCommand request, CancellationToken ct)
    {
        var tokenHash = HashToken(request.RefreshToken);
        var stored = await context.RefreshTokens
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash && !t.IsRevoked && !t.IsDeleted, ct);

        if (stored is not null)
        {
            stored.IsRevoked = true;
            stored.UpdatedAt = DateTime.UtcNow;
            await context.SaveChangesAsync(ct);
        }
    }
}
