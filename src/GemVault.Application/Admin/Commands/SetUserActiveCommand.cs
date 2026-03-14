using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;

namespace GemVault.Application.Admin.Commands;

public record SetUserActiveCommand(Guid UserId, bool IsDeleted) : IRequest;

public class SetUserActiveCommandHandler(IAdminUserService adminUserService)
    : IRequestHandler<SetUserActiveCommand>
{
    public async Task Handle(SetUserActiveCommand request, CancellationToken ct)
    {
        var errors = await adminUserService.SetUserDeletedAsync(request.UserId, request.IsDeleted, ct);
        if (errors.Count > 0)
            throw new ValidationException(string.Join("; ", errors));
    }
}
