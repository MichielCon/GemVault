using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.GemParcels.DTOs;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.GemParcels.Commands;

public record UpdateGemParcelCommand(
    Guid Id,
    string Name,
    string? Species,
    string? Variety,
    int Quantity,
    decimal? TotalWeightCarats,
    string? Color,
    string? Treatment,
    decimal? PurchasePrice,
    DateTime? AcquiredAt,
    string? Notes,
    bool IsPublic,
    Guid? OriginId) : IRequest<GemParcelDto>;

public class UpdateGemParcelCommandValidator : AbstractValidator<UpdateGemParcelCommand>
{
    public UpdateGemParcelCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Quantity).GreaterThan(0);
        RuleFor(x => x.TotalWeightCarats).GreaterThan(0).When(x => x.TotalWeightCarats.HasValue);
        RuleFor(x => x.PurchasePrice).GreaterThanOrEqualTo(0).When(x => x.PurchasePrice.HasValue);
        RuleFor(x => x.Notes).MaximumLength(5000).When(x => x.Notes != null);
    }
}

public class UpdateGemParcelCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<UpdateGemParcelCommand, GemParcelDto>
{
    public async Task<GemParcelDto> Handle(UpdateGemParcelCommand request, CancellationToken ct)
    {
        var parcel = await context.GemParcels
            .Include(p => p.Photos)
            .Include(p => p.Origin)
            .Include(p => p.PublicToken)
            .FirstOrDefaultAsync(p => p.Id == request.Id && !p.IsDeleted, ct)
            ?? throw new NotFoundException("GemParcel", request.Id);

        if (parcel.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        parcel.Name = request.Name;
        parcel.Species = request.Species;
        parcel.Variety = request.Variety;
        parcel.Quantity = request.Quantity;
        parcel.TotalWeightCarats = request.TotalWeightCarats;
        parcel.Color = request.Color;
        parcel.Treatment = request.Treatment;
        parcel.PurchasePrice = request.PurchasePrice;
        parcel.AcquiredAt = request.AcquiredAt.HasValue
            ? DateTime.SpecifyKind(request.AcquiredAt.Value, DateTimeKind.Utc)
            : null;
        parcel.Notes = request.Notes;
        parcel.OriginId = request.OriginId;

        if (request.IsPublic)
        {
            if (parcel.PublicToken is null)
                parcel.PublicToken = new PublicToken { GemParcelId = parcel.Id };
            else
                parcel.PublicToken.IsActive = true;
        }
        else if (parcel.PublicToken is not null)
        {
            parcel.PublicToken.IsActive = false;
        }

        parcel.IsPublic = request.IsPublic;
        await context.SaveChangesAsync(ct);

        return parcel.ToDto(storage);
    }
}
