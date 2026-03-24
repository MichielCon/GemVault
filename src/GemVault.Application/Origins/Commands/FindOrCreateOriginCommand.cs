using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Origins.DTOs;
using GemVault.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Origins.Commands;

public record FindOrCreateOriginCommand(string Country, string? Locality) : IRequest<OriginDto>;

public class FindOrCreateOriginCommandValidator : AbstractValidator<FindOrCreateOriginCommand>
{
    public FindOrCreateOriginCommandValidator()
    {
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Locality).MaximumLength(200);
    }
}

public class FindOrCreateOriginCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<FindOrCreateOriginCommand, OriginDto>
{
    public async Task<OriginDto> Handle(FindOrCreateOriginCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        // Null-safe equality: both null or both equal string values
        var existing = await context.Origins
            .Where(o => o.Country == request.Country &&
                        (request.Locality == null ? o.Locality == null : o.Locality == request.Locality))
            .FirstOrDefaultAsync(ct);

        if (existing is not null)
            return new OriginDto(existing.Id, existing.Country, existing.Locality, existing.CreatedAt);

        var origin = new Origin
        {
            Country = request.Country,
            Locality = request.Locality,
        };

        context.Origins.Add(origin);
        await context.SaveChangesAsync(ct);

        return new OriginDto(origin.Id, origin.Country, origin.Locality, origin.CreatedAt);
    }
}
