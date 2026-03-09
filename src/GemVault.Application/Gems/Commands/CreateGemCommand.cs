using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Gems.DTOs;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;

namespace GemVault.Application.Gems.Commands;

public record CreateGemCommand(
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
    string? Notes,
    bool IsPublic,
    Guid? OriginId,
    string? Attributes) : IRequest<GemDto>;

public class CreateGemCommandValidator : AbstractValidator<CreateGemCommand>
{
    public CreateGemCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.WeightCarats).GreaterThan(0).When(x => x.WeightCarats.HasValue);
        RuleFor(x => x.PurchasePrice).GreaterThanOrEqualTo(0).When(x => x.PurchasePrice.HasValue);
        RuleFor(x => x.Attributes)
            .Must(BeValidJson)
            .WithMessage("Attributes must be a valid JSON object.")
            .When(x => x.Attributes is not null);
    }

    private static bool BeValidJson(string? value)
    {
        if (value is null) return true;
        try { System.Text.Json.JsonDocument.Parse(value); return true; }
        catch { return false; }
    }
}

public class CreateGemCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<CreateGemCommand, GemDto>
{
    public async Task<GemDto> Handle(CreateGemCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var gem = new Gem
        {
            Name = request.Name,
            Species = request.Species,
            Variety = request.Variety,
            WeightCarats = request.WeightCarats,
            Color = request.Color,
            Clarity = request.Clarity,
            Cut = request.Cut,
            Treatment = request.Treatment,
            Shape = request.Shape,
            LengthMm = request.LengthMm,
            WidthMm = request.WidthMm,
            HeightMm = request.HeightMm,
            PurchasePrice = request.PurchasePrice,
            Notes = request.Notes,
            IsPublic = request.IsPublic,
            OwnerId = currentUser.UserId.Value,
            OriginId = request.OriginId,
            Attributes = request.Attributes,
        };

        if (request.IsPublic)
            gem.PublicToken = new PublicToken { GemId = gem.Id };

        context.Gems.Add(gem);
        await context.SaveChangesAsync(ct);

        return gem.ToDto(storage);
    }
}
