using FluentValidation;
using GemVault.Application.Admin.DTOs;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using MediatR;

namespace GemVault.Application.Admin.Queries;

public record GetAdminUsersQuery(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    string? Role = null,
    bool? IsDeleted = null) : IRequest<PagedResult<AdminUserDto>>;

public class GetAdminUsersQueryValidator : AbstractValidator<GetAdminUsersQuery>
{
    public GetAdminUsersQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}

public class GetAdminUsersQueryHandler(IAdminUserService adminUserService)
    : IRequestHandler<GetAdminUsersQuery, PagedResult<AdminUserDto>>
{
    public Task<PagedResult<AdminUserDto>> Handle(GetAdminUsersQuery request, CancellationToken ct)
        => adminUserService.GetUsersAsync(
            request.Page, Math.Min(request.PageSize, 100), request.Search, request.Role, request.IsDeleted, ct);
}
