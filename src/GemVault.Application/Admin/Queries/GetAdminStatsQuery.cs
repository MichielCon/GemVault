using GemVault.Application.Admin.DTOs;
using GemVault.Application.Interfaces;
using MediatR;

namespace GemVault.Application.Admin.Queries;

public record GetAdminStatsQuery : IRequest<AdminStatsDto>;

public class GetAdminStatsQueryHandler(IAdminUserService adminUserService)
    : IRequestHandler<GetAdminStatsQuery, AdminStatsDto>
{
    public Task<AdminStatsDto> Handle(GetAdminStatsQuery request, CancellationToken ct)
        => adminUserService.GetAdminStatsAsync(ct);
}
