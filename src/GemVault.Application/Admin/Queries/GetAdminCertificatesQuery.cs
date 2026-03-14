using GemVault.Application.Admin.DTOs;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Admin.Queries;

public record GetAdminCertificatesQuery(int Page = 1, int PageSize = 20, string? Search = null)
    : IRequest<PagedResult<AdminCertificateDto>>;

public class GetAdminCertificatesQueryHandler(
    IApplicationDbContext context,
    IAdminUserService adminUserService,
    IStorageService storage)
    : IRequestHandler<GetAdminCertificatesQuery, PagedResult<AdminCertificateDto>>
{
    public async Task<PagedResult<AdminCertificateDto>> Handle(GetAdminCertificatesQuery request, CancellationToken ct)
    {
        var query = context.Certificates
            .Include(c => c.Gem)
            .Where(c => !c.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var filteredOwnerIds = await adminUserService.GetUserIdsByEmailAsync(request.Search, ct);
            if (filteredOwnerIds.Count == 0)
                return new PagedResult<AdminCertificateDto>([], 0, request.Page, request.PageSize);
            query = query.Where(c => c.Gem != null && filteredOwnerIds.Contains(c.Gem.OwnerId));
        }

        var total = await query.CountAsync(ct);

        var certs = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        var ownerIds = certs
            .Where(c => c.Gem is not null)
            .Select(c => c.Gem!.OwnerId)
            .Distinct();
        var emailMap = await adminUserService.GetUserEmailMapAsync(ownerIds, ct);

        var dtos = certs.Select(c =>
        {
            var ownerId = c.Gem?.OwnerId ?? Guid.Empty;
            var fileUrl = !string.IsNullOrEmpty(c.ObjectKey) ? storage.GetPublicUrl(c.ObjectKey) : null;
            return new AdminCertificateDto(
                c.Id,
                c.CertNumber,
                c.Lab,
                c.Grade,
                c.IssueDate,
                fileUrl,
                c.GemId,
                c.Gem?.Name ?? "(unknown)",
                ownerId,
                emailMap.GetValueOrDefault(ownerId, "(unknown)"),
                c.CreatedAt);
        }).ToList();

        return new PagedResult<AdminCertificateDto>(dtos, total, request.Page, request.PageSize);
    }
}
