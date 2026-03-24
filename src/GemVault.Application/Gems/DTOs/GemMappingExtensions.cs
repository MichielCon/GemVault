using GemVault.Application.Certificates;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;

namespace GemVault.Application.Gems.DTOs;

internal static class GemMappingExtensions
{
    internal static GemDto ToDto(this Gem gem, IStorageService storage)
    {
        var soldItem = gem.SaleItems
            .Where(si => !si.IsDeleted && si.Sale != null && !si.Sale.IsDeleted)
            .OrderByDescending(si => si.Sale!.SaleDate)
            .FirstOrDefault();

        var soldInfo = soldItem is not null
            ? new GemSoldInfoDto(soldItem.Sale!.Id, soldItem.Sale.SaleDate, soldItem.SalePrice)
            : null;

        return new GemDto(
            gem.Id,
            gem.Name,
            gem.Species,
            gem.Variety,
            gem.WeightCarats,
            gem.Color,
            gem.Clarity,
            gem.Cut,
            gem.Treatment,
            gem.Shape,
            gem.LengthMm,
            gem.WidthMm,
            gem.HeightMm,
            gem.PurchasePrice,
            gem.AcquiredAt,
            gem.Notes,
            gem.IsPublic,
            gem.OwnerId,
            gem.OriginId,
            gem.Origin?.Country,
            gem.Attributes,
            gem.PublicToken?.Token,
            gem.CreatedAt,
            gem.UpdatedAt,
            gem.Photos
                .Where(p => !p.IsDeleted)
                .Select(p => new GemPhotoDto(p.Id, storage.GetPublicUrl(p.ObjectKey), p.IsCover, p.CreatedAt))
                .ToList(),
            soldInfo,
            gem.Certificates
                .Where(c => !c.IsDeleted)
                .Select(c => new CertificateDto(
                    c.Id,
                    c.CertNumber,
                    c.Lab,
                    c.Grade,
                    c.IssueDate,
                    c.ObjectKey != null ? storage.GetPublicUrl(c.ObjectKey) : null,
                    c.GemId,
                    c.CreatedAt))
                .ToList());
    }
}
