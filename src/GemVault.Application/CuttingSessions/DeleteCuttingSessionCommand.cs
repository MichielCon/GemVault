using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.CuttingSessions;

public record DeleteCuttingSessionCommand(Guid SessionId) : IRequest;

public class DeleteCuttingSessionCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<DeleteCuttingSessionCommand>
{
    public async Task Handle(DeleteCuttingSessionCommand request, CancellationToken ct)
    {
        var session = await context.CuttingSessions
            .FirstOrDefaultAsync(s => s.Id == request.SessionId && !s.IsDeleted, ct)
            ?? throw new NotFoundException("CuttingSession", request.SessionId);

        var gem = await context.Gems
            .FirstOrDefaultAsync(g => g.Id == session.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", session.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        session.IsDeleted = true;
        await context.SaveChangesAsync(ct);
    }
}
