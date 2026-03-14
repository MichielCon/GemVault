using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using AppValidationException = GemVault.Application.Common.Exceptions.ValidationException;

namespace GemVault.Application.Profile.Commands;

public record UpdateDisplayNameCommand(string? DisplayName) : IRequest;

public class UpdateDisplayNameCommandValidator : AbstractValidator<UpdateDisplayNameCommand>
{
    public UpdateDisplayNameCommandValidator()
    {
        RuleFor(x => x.DisplayName).MaximumLength(100).When(x => x.DisplayName is not null);
    }
}

public class UpdateDisplayNameCommandHandler(
    IIdentityService identityService,
    ICurrentUserService currentUser)
    : IRequestHandler<UpdateDisplayNameCommand>
{
    public async Task Handle(UpdateDisplayNameCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var errors = await identityService.UpdateDisplayNameAsync(currentUser.UserId.Value, request.DisplayName, ct);
        if (errors.Count > 0)
            throw new AppValidationException(string.Join("; ", errors));
    }
}
