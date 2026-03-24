using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Sales.Queries;

public record SaleExportDto(
    string SaleDate,
    string? BuyerName,
    string ItemName,
    string? ItemSpecies,
    decimal SalePrice,
    int Quantity,
    decimal LineTotal,
    string? SaleNotes);

public record ExportSalesQuery : IRequest<List<SaleExportDto>>;

public class ExportSalesQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<ExportSalesQuery, List<SaleExportDto>>
{
    public async Task<List<SaleExportDto>> Handle(ExportSalesQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var userId = currentUser.UserId.Value;

        return await context.SaleItems
            .Where(si => !si.IsDeleted && !si.Sale.IsDeleted && si.Sale.OwnerId == userId)
            .Include(si => si.Sale)
            .Include(si => si.Gem)
            .Include(si => si.GemParcel)
            .OrderByDescending(si => si.Sale.SaleDate)
            .Select(si => new SaleExportDto(
                si.Sale.SaleDate.ToString("yyyy-MM-dd"),
                si.Sale.BuyerName,
                si.Gem != null ? si.Gem.Name : si.GemParcel != null ? si.GemParcel.Name : "",
                si.Gem != null ? si.Gem.Species : si.GemParcel != null ? si.GemParcel.Species : null,
                si.SalePrice,
                si.Quantity,
                si.SalePrice * si.Quantity,
                si.Sale.Notes))
            .ToListAsync(ct);
    }
}
