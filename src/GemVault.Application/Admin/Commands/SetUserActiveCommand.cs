using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;

namespace GemVault.Application.Admin.Commands;

// IsDeactivated = true means the user is being deactivated (IsDeleted = true in the DB).
// IsDeactivated = false means the user is being reactivated (IsDeleted = false in the DB).
public record SetUserActiveCommand(Guid UserId, bool IsDeactivated) : IRequest;

public class SetUserActiveCommandHandler(IAdminUserService adminUserService)
    : IRequestHandler<SetUserActiveCommand>
{
    public async Task Handle(SetUserActiveCommand request, CancellationToken ct)
    {
        var errors = await adminUserService.SetUserDeletedAsync(request.UserId, request.IsDeactivated, ct);
        if (errors.Count > 0)
            throw new ValidationException(string.Join("; ", errors));
    }
}
