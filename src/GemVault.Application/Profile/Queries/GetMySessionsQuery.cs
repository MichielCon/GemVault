using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Profile.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Profile.Queries;

public record GetMySessionsQuery : IRequest<List<ProfileSessionDto>>;

public class GetMySessionsQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<GetMySessionsQuery, List<ProfileSessionDto>>
{
    public async Task<List<ProfileSessionDto>> Handle(GetMySessionsQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var userId = currentUser.UserId.Value;
        var now = DateTime.UtcNow;

        var tokens = await context.RefreshTokens
            .Where(t => t.UserId == userId && !t.IsRevoked && !t.IsDeleted)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(ct);

        return tokens.Select(t => new ProfileSessionDto(
            t.Id,
            t.CreatedAt,
            t.ExpiresAt,
            t.ExpiresAt < now)).ToList();
    }
}
