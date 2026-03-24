using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.GemParcels.DTOs;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;

namespace GemVault.Application.GemParcels.Commands;

public record CreateGemParcelCommand(
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

public class CreateGemParcelCommandValidator : AbstractValidator<CreateGemParcelCommand>
{
    public CreateGemParcelCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Quantity).GreaterThan(0);
        RuleFor(x => x.TotalWeightCarats).GreaterThan(0).When(x => x.TotalWeightCarats.HasValue);
        RuleFor(x => x.PurchasePrice).GreaterThanOrEqualTo(0).When(x => x.PurchasePrice.HasValue);
        RuleFor(x => x.Notes).MaximumLength(5000).When(x => x.Notes != null);
    }
}

public class CreateGemParcelCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<CreateGemParcelCommand, GemParcelDto>
{
    public async Task<GemParcelDto> Handle(CreateGemParcelCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var parcel = new GemParcel
        {
            Name = request.Name,
            Species = request.Species,
            Variety = request.Variety,
            Quantity = request.Quantity,
            TotalWeightCarats = request.TotalWeightCarats,
            Color = request.Color,
            Treatment = request.Treatment,
            PurchasePrice = request.PurchasePrice,
            AcquiredAt = request.AcquiredAt.HasValue
                ? DateTime.SpecifyKind(request.AcquiredAt.Value, DateTimeKind.Utc)
                : null,
            Notes = request.Notes,
            IsPublic = request.IsPublic,
            OwnerId = currentUser.UserId.Value,
            OriginId = request.OriginId,
        };

        if (request.IsPublic)
            parcel.PublicToken = new PublicToken { GemParcelId = parcel.Id };

        context.GemParcels.Add(parcel);
        await context.SaveChangesAsync(ct);

        return parcel.ToDto(storage);
    }
}
