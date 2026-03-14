using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Profile.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Profile.Queries;

public record GetProfileQuery : IRequest<ProfileDto>;

public class GetProfileQueryHandler(
    IApplicationDbContext context,
    IIdentityService identityService,
    ICurrentUserService currentUser)
    : IRequestHandler<GetProfileQuery, ProfileDto>
{
    public async Task<ProfileDto> Handle(GetProfileQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var userId = currentUser.UserId.Value;

        var profile = await identityService.GetProfileAsync(userId, ct);
        if (!profile.Found)
            throw new NotFoundException("User", userId);

        var gemCount = await context.Gems
            .CountAsync(g => g.OwnerId == userId && !g.IsDeleted, ct);

        var parcelCount = await context.GemParcels
            .CountAsync(p => p.OwnerId == userId && !p.IsDeleted, ct);

        return new ProfileDto(
            userId,
            profile.Email,
            profile.DisplayName,
            profile.Role.ToString(),
            profile.CreatedAt,
            gemCount,
            parcelCount);
    }
}
