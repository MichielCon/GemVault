using FluentValidation;
using GemVault.Application.Interfaces;
using MediatR;
using ValidationException = GemVault.Application.Common.Exceptions.ValidationException;

namespace GemVault.Application.Auth.Commands;

public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<Unit>;

public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Token).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(10).MaximumLength(128);
    }
}

public class ResetPasswordCommandHandler(IIdentityService identityService)
    : IRequestHandler<ResetPasswordCommand, Unit>
{
    public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken ct)
    {
        var errors = await identityService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword, ct);

        if (errors.Count > 0)
            throw new ValidationException(errors[0]);

        return Unit.Value;
    }
}
