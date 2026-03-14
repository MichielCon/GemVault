using GemVault.Application.Admin.DTOs;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Admin.Queries;

public record GetAdminPhotosQuery(int Page = 1, int PageSize = 20, string? Search = null)
    : IRequest<PagedResult<AdminPhotoDto>>;

public class GetAdminPhotosQueryHandler(
    IApplicationDbContext context,
    IAdminUserService adminUserService,
    IStorageService storage)
    : IRequestHandler<GetAdminPhotosQuery, PagedResult<AdminPhotoDto>>
{
    public async Task<PagedResult<AdminPhotoDto>> Handle(GetAdminPhotosQuery request, CancellationToken ct)
    {
        var query = context.GemPhotos
            .Include(p => p.Gem)
            .Include(p => p.GemParcel)
            .Where(p => !p.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var filteredOwnerIds = await adminUserService.GetUserIdsByEmailAsync(request.Search, ct);
            if (filteredOwnerIds.Count == 0)
                return new PagedResult<AdminPhotoDto>([], 0, request.Page, request.PageSize);
            query = query.Where(p =>
                (p.GemId != null && filteredOwnerIds.Contains(p.Gem!.OwnerId)) ||
                (p.GemParcelId != null && filteredOwnerIds.Contains(p.GemParcel!.OwnerId)));
        }

        var total = await query.CountAsync(ct);

        var photos = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        var ownerIds = new HashSet<Guid>();
        foreach (var p in photos)
        {
            if (p.Gem is not null) ownerIds.Add(p.Gem.OwnerId);
            else if (p.GemParcel is not null) ownerIds.Add(p.GemParcel.OwnerId);
        }
        var emailMap = await adminUserService.GetUserEmailMapAsync(ownerIds, ct);

        var dtos = photos.Select(p =>
        {
            var ownerId = p.Gem?.OwnerId ?? p.GemParcel?.OwnerId ?? Guid.Empty;
            return new AdminPhotoDto(
                p.Id,
                storage.GetPublicUrl(p.ObjectKey),
                p.FileName,
                p.FileSizeBytes,
                p.ContentType,
                p.GemId,
                p.Gem?.Name,
                p.GemParcelId,
                p.GemParcel?.Name,
                ownerId,
                emailMap.GetValueOrDefault(ownerId, "(unknown)"),
                p.IsCover,
                p.CreatedAt);
        }).ToList();

        return new PagedResult<AdminPhotoDto>(dtos, total, request.Page, request.PageSize);
    }
}
