using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Profile.Commands;

public record DeleteAccountCommand(string CurrentPassword) : IRequest;

public class DeleteAccountCommandHandler(
    IApplicationDbContext context,
    IIdentityService identityService,
    ICurrentUserService currentUser)
    : IRequestHandler<DeleteAccountCommand>
{
    public async Task Handle(DeleteAccountCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var userId = currentUser.UserId.Value;

        var profile = await identityService.GetProfileAsync(userId, ct);
        if (!profile.Found)
            throw new ForbiddenException();

        var (valid, _, _, _) = await identityService.ValidateCredentialsAsync(profile.Email, request.CurrentPassword, ct);
        if (!valid)
            throw new ValidationException("Current password is incorrect.");

        // Soft-delete the user via IIdentityService
        var errors = await identityService.SoftDeleteUserAsync(userId, ct);
        if (errors.Count > 0)
            throw new ValidationException(string.Join("; ", errors));

        // Revoke all refresh tokens
        var tokens = await context.RefreshTokens
            .Where(t => t.UserId == userId && !t.IsRevoked && !t.IsDeleted)
            .ToListAsync(ct);

        foreach (var token in tokens)
            token.IsRevoked = true;

        await context.SaveChangesAsync(ct);
    }
}
