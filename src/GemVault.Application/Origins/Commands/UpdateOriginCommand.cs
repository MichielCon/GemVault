using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Origins.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Origins.Commands;

public record UpdateOriginCommand(Guid Id, string Country, string? Mine, string? Region) : IRequest<OriginDto>;

public class UpdateOriginCommandValidator : AbstractValidator<UpdateOriginCommand>
{
    public UpdateOriginCommandValidator()
    {
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
    }
}

public class UpdateOriginCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<UpdateOriginCommand, OriginDto>
{
    public async Task<OriginDto> Handle(UpdateOriginCommand request, CancellationToken ct)
    {
        if (currentUser.Role != "Admin")
            throw new ForbiddenException("Only administrators can update origins.");

        var origin = await context.Origins
            .FirstOrDefaultAsync(o => o.Id == request.Id, ct)
            ?? throw new NotFoundException("Origin", request.Id);

        origin.Country = request.Country;
        origin.Mine = request.Mine;
        origin.Region = request.Region;

        await context.SaveChangesAsync(ct);

        return new OriginDto(origin.Id, origin.Country, origin.Mine, origin.Region, origin.CreatedAt);
    }
}
