using GemVault.Application.Admin.DTOs;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Admin.Queries;

public record GetAdminDesignFilesQuery(int Page = 1, int PageSize = 20, string? Search = null)
    : IRequest<PagedResult<AdminDesignFileDto>>;

public class GetAdminDesignFilesQueryHandler(
    IApplicationDbContext context,
    IAdminUserService adminUserService,
    IStorageService storage)
    : IRequestHandler<GetAdminDesignFilesQuery, PagedResult<AdminDesignFileDto>>
{
    public async Task<PagedResult<AdminDesignFileDto>> Handle(GetAdminDesignFilesQuery request, CancellationToken ct)
    {
        var query = context.DesignFiles
            .Include(d => d.Gem)
            .Where(d => !d.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var filteredOwnerIds = await adminUserService.GetUserIdsByEmailAsync(request.Search, ct);
            if (filteredOwnerIds.Count == 0)
                return new PagedResult<AdminDesignFileDto>([], 0, request.Page, request.PageSize);
            query = query.Where(d => d.Gem != null && filteredOwnerIds.Contains(d.Gem.OwnerId));
        }

        var total = await query.CountAsync(ct);

        var files = await query
            .OrderByDescending(d => d.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        var ownerIds = files
            .Where(d => d.Gem is not null)
            .Select(d => d.Gem!.OwnerId)
            .Distinct();
        var emailMap = await adminUserService.GetUserEmailMapAsync(ownerIds, ct);

        var dtos = files.Select(d =>
        {
            var ownerId = d.Gem?.OwnerId ?? Guid.Empty;
            var fileUrl = !string.IsNullOrEmpty(d.ObjectKey) ? storage.GetPublicUrl(d.ObjectKey) : null;
            return new AdminDesignFileDto(
                d.Id,
                d.FileName,
                fileUrl,
                d.ContentType,
                d.FileSize,
                d.GemId,
                d.Gem?.Name ?? "(unknown)",
                ownerId,
                emailMap.GetValueOrDefault(ownerId, "(unknown)"),
                d.CreatedAt);
        }).ToList();

        return new PagedResult<AdminDesignFileDto>(dtos, total, request.Page, request.PageSize);
    }
}
