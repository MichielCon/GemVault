using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;

namespace GemVault.Application.GemParcels.DTOs;

internal static class GemParcelMappingExtensions
{
    internal static GemParcelDto ToDto(this GemParcel p, IStorageService storage)
    {
        var soldItem = p.SaleItems
            .Where(si => !si.IsDeleted && si.Sale != null)
            .OrderBy(si => si.Sale!.SaleDate)
            .FirstOrDefault();
        var soldInfo = soldItem != null
            ? new GemParcelSoldInfoDto(soldItem.SaleId, soldItem.Sale!.SaleDate, soldItem.SalePrice)
            : null;

        return new GemParcelDto(
            p.Id,
            p.Name,
            p.Species,
            p.Variety,
            p.Quantity,
            p.TotalWeightCarats,
            p.Color,
            p.Treatment,
            p.PurchasePrice,
            p.Notes,
            p.IsPublic,
            p.OwnerId,
            p.OriginId,
            p.Origin?.Country,
            p.PublicToken?.Token,
            p.CreatedAt,
            p.UpdatedAt,
            p.Photos
                .Where(ph => !ph.IsDeleted)
                .Select(ph => new GemParcelPhotoDto(ph.Id, storage.GetPublicUrl(ph.ObjectKey), ph.IsCover, ph.CreatedAt))
                .ToList(),
            soldInfo);
    }

    internal static GemParcelSummaryDto ToSummaryDto(this GemParcel p, IStorageService storage, bool isSold = false)
    {
        var cover = p.Photos.FirstOrDefault(ph => ph.IsCover && !ph.IsDeleted)?.ObjectKey;
        return new GemParcelSummaryDto(
            p.Id,
            p.Name,
            p.Species,
            p.Variety,
            p.Quantity,
            p.TotalWeightCarats,
            p.Color,
            p.IsPublic,
            cover != null ? storage.GetPublicUrl(cover) : null,
            p.CreatedAt,
            isSold);
    }
}
