using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using GemVault.Domain.Enums;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.CuttingSessions;

public record CreateCuttingSessionCommand(
    Guid GemId,
    DateTime SessionDate,
    CuttingStage Stage,
    decimal? HoursSpent,
    string? Notes) : IRequest<CuttingSessionDto>;

public class CreateCuttingSessionCommandValidator : AbstractValidator<CreateCuttingSessionCommand>
{
    public CreateCuttingSessionCommandValidator()
    {
        RuleFor(x => x.SessionDate).LessThanOrEqualTo(DateTime.UtcNow.AddDays(1))
            .WithMessage("Session date cannot be in the future.");
        RuleFor(x => x.HoursSpent).GreaterThan(0).When(x => x.HoursSpent.HasValue);
        RuleFor(x => x.Notes).MaximumLength(2000).When(x => x.Notes != null);
    }
}

public class CreateCuttingSessionCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<CreateCuttingSessionCommand, CuttingSessionDto>
{
    public async Task<CuttingSessionDto> Handle(CreateCuttingSessionCommand request, CancellationToken ct)
    {
        var gem = await context.Gems
            .FirstOrDefaultAsync(g => g.Id == request.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", request.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        var session = new GemCuttingSession
        {
            GemId = request.GemId,
            SessionDate = DateTime.SpecifyKind(request.SessionDate, DateTimeKind.Utc),
            Stage = request.Stage,
            HoursSpent = request.HoursSpent,
            Notes = request.Notes,
        };

        context.CuttingSessions.Add(session);
        await context.SaveChangesAsync(ct);

        return new CuttingSessionDto(
            session.Id,
            session.SessionDate,
            session.Stage.ToString(),
            session.HoursSpent,
            session.Notes,
            session.CreatedAt);
    }
}
