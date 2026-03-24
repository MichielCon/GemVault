using FluentValidation;
using GemVault.Application.Interfaces;
using MediatR;
using ValidationException = GemVault.Application.Common.Exceptions.ValidationException;

namespace GemVault.Application.Auth.Commands;

public record VerifyEmailCommand(string Email, string Token) : IRequest<Unit>;

public class VerifyEmailCommandValidator : AbstractValidator<VerifyEmailCommand>
{
    public VerifyEmailCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Token).NotEmpty();
    }
}

public class VerifyEmailCommandHandler(IIdentityService identityService)
    : IRequestHandler<VerifyEmailCommand, Unit>
{
    public async Task<Unit> Handle(VerifyEmailCommand request, CancellationToken ct)
    {
        var errors = await identityService.ConfirmEmailAsync(request.Email, request.Token, ct);
        if (errors.Count > 0)
            throw new ValidationException(string.Join("; ", errors));
        return Unit.Value;
    }
}
