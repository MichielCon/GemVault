using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace GemVault.Application.Auth.Commands;

public record ResendVerificationCommand(Guid UserId, string Email) : IRequest<Unit>;

public class ResendVerificationCommandHandler(
    IIdentityService identityService,
    ILogger<ResendVerificationCommandHandler> logger)
    : IRequestHandler<ResendVerificationCommand, Unit>
{
    public async Task<Unit> Handle(ResendVerificationCommand request, CancellationToken ct)
    {
        var (found, token) = await identityService.GenerateEmailConfirmationTokenAsync(request.UserId, ct);
        if (found)
        {
            // TODO: Send via SMTP. For now, log for dev access.
            logger.LogInformation(
                "Email confirmation token for {Email}: {Token}", request.Email, token);
        }
        return Unit.Value;
    }
}
