using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;

namespace GemVault.Application.Gems.DTOs;

internal static class GemMappingExtensions
{
    internal static GemDto ToDto(this Gem gem, IStorageService storage) => new(
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
            .ToList());
}
