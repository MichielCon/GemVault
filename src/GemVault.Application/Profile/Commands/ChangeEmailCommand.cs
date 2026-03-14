using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using AppValidationException = GemVault.Application.Common.Exceptions.ValidationException;

namespace GemVault.Application.Profile.Commands;

public record ChangeEmailCommand(string CurrentPassword, string NewEmail) : IRequest;

public class ChangeEmailCommandValidator : AbstractValidator<ChangeEmailCommand>
{
    public ChangeEmailCommandValidator()
    {
        RuleFor(x => x.CurrentPassword).NotEmpty();
        RuleFor(x => x.NewEmail).NotEmpty().EmailAddress();
    }
}

public class ChangeEmailCommandHandler(
    IIdentityService identityService,
    ICurrentUserService currentUser)
    : IRequestHandler<ChangeEmailCommand>
{
    public async Task Handle(ChangeEmailCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        // Validate current password first by looking up the user's email
        var profile = await identityService.GetProfileAsync(currentUser.UserId.Value, ct);
        if (!profile.Found)
            throw new ForbiddenException();

        var (valid, _, _, _) = await identityService.ValidateCredentialsAsync(profile.Email, request.CurrentPassword, ct);
        if (!valid)
            throw new AppValidationException("Current password is incorrect.");

        var errors = await identityService.UpdateEmailAsync(currentUser.UserId.Value, request.NewEmail, ct);
        if (errors.Count > 0)
            throw new AppValidationException(string.Join("; ", errors));
    }
}
