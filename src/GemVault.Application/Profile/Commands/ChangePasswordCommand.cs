using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using AppValidationException = GemVault.Application.Common.Exceptions.ValidationException;

namespace GemVault.Application.Profile.Commands;

public record ChangePasswordCommand(string CurrentPassword, string NewPassword) : IRequest;

public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(x => x.CurrentPassword).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(8);
    }
}

public class ChangePasswordCommandHandler(
    IIdentityService identityService,
    ICurrentUserService currentUser)
    : IRequestHandler<ChangePasswordCommand>
{
    public async Task Handle(ChangePasswordCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var errors = await identityService.ChangePasswordAsync(
            currentUser.UserId.Value, request.CurrentPassword, request.NewPassword, ct);

        if (errors.Count > 0)
            throw new AppValidationException(string.Join("; ", errors));
    }
}
