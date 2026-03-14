using GemVault.Application.Interfaces;
using MediatR;

namespace GemVault.Application.Admin.Commands;

public record RevokeUserSessionsCommand(Guid UserId) : IRequest<int>;

public class RevokeUserSessionsCommandHandler(IAdminUserService adminUserService)
    : IRequestHandler<RevokeUserSessionsCommand, int>
{
    public Task<int> Handle(RevokeUserSessionsCommand request, CancellationToken ct)
        => adminUserService.RevokeAllUserSessionsAsync(request.UserId, ct);
}
