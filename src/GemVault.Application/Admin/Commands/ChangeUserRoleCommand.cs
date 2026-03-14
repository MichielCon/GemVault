using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Enums;
using MediatR;

namespace GemVault.Application.Admin.Commands;

public record ChangeUserRoleCommand(Guid UserId, string Role) : IRequest;

public class ChangeUserRoleCommandHandler(IAdminUserService adminUserService)
    : IRequestHandler<ChangeUserRoleCommand>
{
    public async Task Handle(ChangeUserRoleCommand request, CancellationToken ct)
    {
        if (!Enum.TryParse<UserRole>(request.Role, out var role) || role == UserRole.Admin)
            throw new ValidationException("Invalid role. Cannot assign Admin role.");

        var errors = await adminUserService.ChangeUserRoleAsync(request.UserId, role, ct);
        if (errors.Count > 0)
            throw new ValidationException(string.Join("; ", errors));
    }
}
