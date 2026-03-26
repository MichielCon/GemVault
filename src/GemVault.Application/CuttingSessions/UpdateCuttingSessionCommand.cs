using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Enums;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.CuttingSessions;

public record UpdateCuttingSessionCommand(
    Guid SessionId,
    DateTime SessionDate,
    CuttingStage Stage,
    decimal? HoursSpent,
    string? Notes) : IRequest;

public class UpdateCuttingSessionCommandValidator : AbstractValidator<UpdateCuttingSessionCommand>
{
    public UpdateCuttingSessionCommandValidator()
    {
        RuleFor(x => x.SessionDate).LessThanOrEqualTo(DateTime.UtcNow.AddDays(1))
            .WithMessage("Session date cannot be in the future.");
        RuleFor(x => x.HoursSpent).GreaterThan(0).When(x => x.HoursSpent.HasValue);
        RuleFor(x => x.Notes).MaximumLength(2000).When(x => x.Notes != null);
    }
}

public class UpdateCuttingSessionCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<UpdateCuttingSessionCommand>
{
    public async Task Handle(UpdateCuttingSessionCommand request, CancellationToken ct)
    {
        var session = await context.CuttingSessions
            .FirstOrDefaultAsync(s => s.Id == request.SessionId && !s.IsDeleted, ct)
            ?? throw new NotFoundException("CuttingSession", request.SessionId);

        var gem = await context.Gems
            .FirstOrDefaultAsync(g => g.Id == session.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", session.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        session.SessionDate = DateTime.SpecifyKind(request.SessionDate, DateTimeKind.Utc);
        session.Stage = request.Stage;
        session.HoursSpent = request.HoursSpent;
        session.Notes = request.Notes;

        await context.SaveChangesAsync(ct);
    }
}
