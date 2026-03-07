using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Origins.DTOs;
using GemVault.Domain.Entities;
using MediatR;

namespace GemVault.Application.Origins.Commands;

public record CreateOriginCommand(string Country, string? Mine, string? Region) : IRequest<OriginDto>;

public class CreateOriginCommandValidator : AbstractValidator<CreateOriginCommand>
{
    public CreateOriginCommandValidator()
    {
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
    }
}

public class CreateOriginCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<CreateOriginCommand, OriginDto>
{
    public async Task<OriginDto> Handle(CreateOriginCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var origin = new Origin
        {
            Country = request.Country,
            Mine = request.Mine,
            Region = request.Region,
        };

        context.Origins.Add(origin);
        await context.SaveChangesAsync(ct);

        return new OriginDto(origin.Id, origin.Country, origin.Mine, origin.Region, origin.CreatedAt);
    }
}
