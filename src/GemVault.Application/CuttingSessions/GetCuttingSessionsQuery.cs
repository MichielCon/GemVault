using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.CuttingSessions;

public record GetCuttingSessionsQuery(Guid GemId) : IRequest<List<CuttingSessionDto>>;

public class GetCuttingSessionsQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<GetCuttingSessionsQuery, List<CuttingSessionDto>>
{
    public async Task<List<CuttingSessionDto>> Handle(GetCuttingSessionsQuery request, CancellationToken ct)
    {
        var gem = await context.Gems
            .AsNoTracking()
            .FirstOrDefaultAsync(g => g.Id == request.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", request.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        return await context.CuttingSessions
            .AsNoTracking()
            .Where(s => s.GemId == request.GemId && !s.IsDeleted)
            .OrderByDescending(s => s.SessionDate)
            .Select(s => new CuttingSessionDto(s.Id, s.SessionDate, s.Stage.ToString(), s.HoursSpent, s.Notes, s.CreatedAt))
            .ToListAsync(ct);
    }
}
