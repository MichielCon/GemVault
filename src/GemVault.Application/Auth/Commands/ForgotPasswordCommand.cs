using FluentValidation;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace GemVault.Application.Auth.Commands;

public record ForgotPasswordCommand(string Email) : IRequest<Unit>;

public class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
    }
}

public class ForgotPasswordCommandHandler(
    IIdentityService identityService,
    ILogger<ForgotPasswordCommandHandler> logger)
    : IRequestHandler<ForgotPasswordCommand, Unit>
{
    public async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken ct)
    {
        // Always return Unit.Value regardless of whether the email exists
        // to prevent email enumeration attacks.
        var (found, token) = await identityService.GeneratePasswordResetTokenAsync(request.Email, ct);

        if (found)
        {
            // TODO: Send reset email via SMTP when email service is configured.
            logger.LogInformation("Password reset requested for {Email}", request.Email);
        }

        return Unit.Value;
    }
}
