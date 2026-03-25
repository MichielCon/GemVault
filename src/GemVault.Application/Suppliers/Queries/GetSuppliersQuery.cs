using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Suppliers.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Suppliers.Queries;

public record GetSuppliersQuery(string? Search = null) : IRequest<List<SupplierDto>>;

public class GetSuppliersQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<GetSuppliersQuery, List<SupplierDto>>
{
    public async Task<List<SupplierDto>> Handle(GetSuppliersQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var query = context.Suppliers
            .AsNoTracking()
            .Where(s => s.OwnerId == currentUser.UserId && !s.IsDeleted);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(s =>
                s.Name.ToLower().Contains(search) ||
                (s.Email != null && s.Email.ToLower().Contains(search)));
        }

        return await query
            .OrderBy(s => s.Name)
            .Select(s => new SupplierDto(
                s.Id,
                s.Name,
                s.Email,
                s.Phone,
                s.Website,
                s.Address,
                s.Notes,
                s.PurchaseOrders.Count(o => !o.IsDeleted),
                s.CreatedAt))
            .ToListAsync(ct);
    }
}
