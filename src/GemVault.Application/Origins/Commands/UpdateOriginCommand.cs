using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Origins.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Origins.Commands;

public record UpdateOriginCommand(Guid Id, string Country, string? Locality) : IRequest<OriginDto>;

public class UpdateOriginCommandValidator : AbstractValidator<UpdateOriginCommand>
{
    public UpdateOriginCommandValidator()
    {
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Locality).MaximumLength(200);
    }
}

public class UpdateOriginCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<UpdateOriginCommand, OriginDto>
{
    public async Task<OriginDto> Handle(UpdateOriginCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new ForbiddenException("Only administrators can update origins.");

        var origin = await context.Origins
            .FirstOrDefaultAsync(o => o.Id == request.Id, ct)
            ?? throw new NotFoundException("Origin", request.Id);

        origin.Country = request.Country;
        origin.Locality = request.Locality;

        await context.SaveChangesAsync(ct);

        return new OriginDto(origin.Id, origin.Country, origin.Locality, origin.CreatedAt);
    }
}
