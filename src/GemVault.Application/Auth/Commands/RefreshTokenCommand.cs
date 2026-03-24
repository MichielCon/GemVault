using GemVault.Application.Auth.DTOs;
using GemVault.Application.Common.Options;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ValidationException = GemVault.Application.Common.Exceptions.ValidationException;
using static GemVault.Application.Auth.Commands.RegisterCommandHandler;

namespace GemVault.Application.Auth.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResponseDto>;

public class RefreshTokenCommandHandler(
    IApplicationDbContext context,
    IIdentityService identityService,
    IJwtService jwtService,
    IOptions<JwtOptions> jwtOptions)
    : IRequestHandler<RefreshTokenCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        var tokenHash = HashToken(request.RefreshToken);

        var stored = await context.RefreshTokens
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash && !t.IsRevoked && !t.IsDeleted, ct);

        if (stored is null || stored.ExpiresAt < DateTime.UtcNow)
            throw new ValidationException("Invalid or expired refresh token.");

        var (found, email, role) = await identityService.GetUserByIdAsync(stored.UserId, ct);
        if (!found)
            throw new ValidationException("User not found.");

        // Optimistic concurrency: only revoke if the token is still active in the DB.
        // This prevents two concurrent requests from both succeeding with the same refresh token.
        var rowsAffected = await context.ExecuteSqlRawAsync(
            "UPDATE \"RefreshTokens\" SET \"IsRevoked\" = TRUE WHERE \"Id\" = {0} AND \"IsRevoked\" = FALSE",
            ct, stored.Id);
        if (rowsAffected == 0)
            throw new ValidationException("Refresh token has already been used.");

        // Keep EF entity state consistent with the DB update
        stored.IsRevoked = true;
        stored.UpdatedAt = DateTime.UtcNow;

        var newRawRefresh = jwtService.GenerateRefreshToken();
        context.RefreshTokens.Add(new RefreshToken
        {
            UserId = stored.UserId,
            TokenHash = HashToken(newRawRefresh),
            ExpiresAt = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshExpiryDays),
        });
        await context.SaveChangesAsync(ct);

        var emailConfirmed = await identityService.IsEmailConfirmedAsync(stored.UserId, ct);
        var newAccessToken = jwtService.GenerateAccessToken(stored.UserId, email, role, emailConfirmed);
        return new AuthResponseDto(newAccessToken, newRawRefresh, stored.UserId, email, role);
    }
}
