using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Gems.DTOs;
using GemVault.Domain.Entities;
using GemVault.Domain.Enums;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Gems.Commands;

public record UpdateGemCommand(
    Guid GemId,
    string Name,
    string? Species,
    string? Variety,
    decimal? WeightCarats,
    string? Color,
    string? Clarity,
    string? Cut,
    string? Treatment,
    string? Shape,
    decimal? LengthMm,
    decimal? WidthMm,
    decimal? HeightMm,
    decimal? PurchasePrice,
    DateTime? AcquiredAt,
    string? Notes,
    bool IsPublic,
    Guid? OriginId,
    string? Attributes,
    GemStatus Status = GemStatus.Available,
    decimal? RoughWeightCarats = null,
    string? CutPlanNotes = null,
    string? CuttingDesign = null,
    decimal? PavilionAngle = null,
    decimal? CrownAngle = null,
    decimal? TablePct = null,
    int? PlannedFacets = null) : IRequest<GemDto>;

public class UpdateGemCommandValidator : AbstractValidator<UpdateGemCommand>
{
    public UpdateGemCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.WeightCarats).GreaterThan(0).When(x => x.WeightCarats.HasValue);
        RuleFor(x => x.PurchasePrice).GreaterThanOrEqualTo(0).When(x => x.PurchasePrice.HasValue);
        RuleFor(x => x.Notes).MaximumLength(5000).When(x => x.Notes != null);
        RuleFor(x => x.Attributes)
            .Must(BeValidJson)
            .WithMessage("Attributes must be a valid JSON object.")
            .When(x => x.Attributes is not null);
        RuleFor(x => x.RoughWeightCarats).GreaterThan(0).When(x => x.RoughWeightCarats.HasValue);
        RuleFor(x => x.CutPlanNotes).MaximumLength(2000).When(x => x.CutPlanNotes != null);
        RuleFor(x => x.PavilionAngle).InclusiveBetween(0, 90).When(x => x.PavilionAngle.HasValue);
        RuleFor(x => x.CrownAngle).InclusiveBetween(0, 90).When(x => x.CrownAngle.HasValue);
        RuleFor(x => x.TablePct).InclusiveBetween(0, 100).When(x => x.TablePct.HasValue);
        RuleFor(x => x.PlannedFacets).GreaterThan(0).When(x => x.PlannedFacets.HasValue);
        RuleFor(x => x.CuttingDesign).MaximumLength(200).When(x => x.CuttingDesign != null);
    }

    private static bool BeValidJson(string? value)
    {
        if (value is null) return true;
        try { System.Text.Json.JsonDocument.Parse(value); return true; }
        catch { return false; }
    }
}

public class UpdateGemCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<UpdateGemCommand, GemDto>
{
    public async Task<GemDto> Handle(UpdateGemCommand request, CancellationToken ct)
    {
        var gem = await context.Gems
            .Include(g => g.Photos)
            .Include(g => g.Origin)
            .Include(g => g.PublicToken)
            .FirstOrDefaultAsync(g => g.Id == request.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", request.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        gem.Name = request.Name;
        gem.Species = request.Species;
        gem.Variety = request.Variety;
        gem.WeightCarats = request.WeightCarats;
        gem.Color = request.Color;
        gem.Clarity = request.Clarity;
        gem.Cut = request.Cut;
        gem.Treatment = request.Treatment;
        gem.Shape = request.Shape;
        gem.LengthMm = request.LengthMm;
        gem.WidthMm = request.WidthMm;
        gem.HeightMm = request.HeightMm;
        gem.PurchasePrice = request.PurchasePrice;
        gem.AcquiredAt = request.AcquiredAt.HasValue
            ? DateTime.SpecifyKind(request.AcquiredAt.Value, DateTimeKind.Utc)
            : null;
        gem.Notes = request.Notes;
        gem.OriginId = request.OriginId;
        gem.Attributes = request.Attributes;
        gem.Status = request.Status;
        gem.RoughWeightCarats = request.RoughWeightCarats;
        gem.CutPlanNotes = request.CutPlanNotes;
        gem.CuttingDesign = request.CuttingDesign;
        gem.PavilionAngle = request.PavilionAngle;
        gem.CrownAngle = request.CrownAngle;
        gem.TablePct = request.TablePct;
        gem.PlannedFacets = request.PlannedFacets;

        // Manage public token
        if (request.IsPublic)
        {
            if (gem.PublicToken is null)
                gem.PublicToken = new PublicToken { GemId = gem.Id };
            else
                gem.PublicToken.IsActive = true;
        }
        else if (gem.PublicToken is not null)
        {
            gem.PublicToken.IsActive = false;
        }

        gem.IsPublic = request.IsPublic;
        await context.SaveChangesAsync(ct);

        return gem.ToDto(storage);
    }
}
