using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Public.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Public.Queries;

public record GetPublicRecordQuery(string Token) : IRequest<PublicGemDto>;

public class GetPublicRecordQueryHandler(
    IApplicationDbContext context,
    IStorageService storage)
    : IRequestHandler<GetPublicRecordQuery, PublicGemDto>
{
    public async Task<PublicGemDto> Handle(GetPublicRecordQuery request, CancellationToken ct)
    {
        // Load the token with both possible related records.
        // Security: return 404 (not 403) for any non-public or missing record
        // to avoid confirming the existence of private gems.
        var token = await context.PublicTokens
            .Include(t => t.Gem)
                .ThenInclude(g => g!.Origin)
            .Include(t => t.Gem)
                .ThenInclude(g => g!.Photos)
            .Include(t => t.Gem)
                .ThenInclude(g => g!.Certificates)
            .Include(t => t.GemParcel)
                .ThenInclude(p => p!.Origin)
            .Include(t => t.GemParcel)
                .ThenInclude(p => p!.Photos)
            .FirstOrDefaultAsync(t => t.Token == request.Token && t.IsActive, ct);

        if (token is null)
            throw new NotFoundException("Record", request.Token);

        // Gem record
        if (token.Gem is not null)
        {
            if (!token.Gem.IsPublic)
                throw new NotFoundException("Record", request.Token);

            token.ScanCount++;
            await context.SaveChangesAsync(ct);
            return MapGem(token.Gem, token.ScanCount);
        }

        // Parcel record
        if (token.GemParcel is not null)
        {
            if (!token.GemParcel.IsPublic)
                throw new NotFoundException("Record", request.Token);

            token.ScanCount++;
            await context.SaveChangesAsync(ct);
            return MapParcel(token.GemParcel, token.ScanCount);
        }

        throw new NotFoundException("Record", request.Token);
    }

    private PublicGemDto MapGem(Domain.Entities.Gem gem, int scanCount) => new(
        gem.Id,
        "Gem",
        gem.Name,
        gem.Species,
        gem.Variety,
        gem.Color,
        gem.Treatment,
        gem.Shape,
        gem.Clarity,
        gem.Cut,
        gem.WeightCarats,
        null,
        null,
        gem.Notes,
        gem.Origin?.Country,
        gem.Origin?.Locality,
        gem.LengthMm,
        gem.WidthMm,
        gem.HeightMm,
        gem.CreatedAt,
        gem.Photos
            .Where(p => !p.IsDeleted)
            .Select(p => new PublicPhotoDto(p.Id, storage.GetPublicUrl(p.ObjectKey), p.IsCover))
            .ToList(),
        gem.Certificates
            .Where(c => !c.IsDeleted)
            .Select(c => new PublicCertificateDto(c.CertNumber, c.Lab, c.Grade, c.IssueDate.HasValue ? DateOnly.FromDateTime(c.IssueDate.Value) : null))
            .ToList(),
        scanCount);

    private PublicGemDto MapParcel(Domain.Entities.GemParcel parcel, int scanCount) => new(
        parcel.Id,
        "Parcel",
        parcel.Name,
        parcel.Species,
        parcel.Variety,
        parcel.Color,
        parcel.Treatment,
        null,
        null,
        null,
        null,
        parcel.TotalWeightCarats,
        parcel.Quantity,
        parcel.Notes,
        parcel.Origin?.Country,
        parcel.Origin?.Locality,
        null,
        null,
        null,
        parcel.CreatedAt,
        parcel.Photos
            .Where(p => !p.IsDeleted)
            .Select(p => new PublicPhotoDto(p.Id, storage.GetPublicUrl(p.ObjectKey), p.IsCover))
            .ToList(),
        [],
        scanCount);
}
