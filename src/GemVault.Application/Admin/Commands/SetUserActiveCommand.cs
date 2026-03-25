using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Enums;
using MediatR;

namespace GemVault.Application.Admin.Commands;

// IsDeleted = true means the user is being deactivated (IsDeleted = true in the DB).
// IsDeleted = false means the user is being reactivated (IsDeleted = false in the DB).
public record SetUserActiveCommand(Guid UserId, bool IsDeleted) : IRequest;

public class SetUserActiveCommandHandler(IAdminUserService adminUserService)
    : IRequestHandler<SetUserActiveCommand>
{
    public async Task Handle(SetUserActiveCommand request, CancellationToken ct)
    {
        // Prevent deactivating the last admin account.
        if (request.IsDeleted)
        {
            var currentRole = await adminUserService.GetUserRoleAsync(request.UserId, ct);
            if (string.Equals(currentRole, UserRole.Admin.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                var adminCount = await adminUserService.CountActiveAdminsAsync(ct);
                if (adminCount <= 1)
                    throw new ValidationException("Cannot deactivate the last admin account.");
            }
        }

        var errors = await adminUserService.SetUserDeletedAsync(request.UserId, request.IsDeleted, ct);
        if (errors.Count > 0)
            throw new ValidationException(string.Join("; ", errors));
    }
}
