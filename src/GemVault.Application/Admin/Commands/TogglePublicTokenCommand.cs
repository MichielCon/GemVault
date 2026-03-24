using GemVault.Application.Admin.DTOs;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Admin.Commands;

public record TogglePublicTokenCommand(Guid TokenId) : IRequest<AdminPublicTokenDto>;

public class TogglePublicTokenCommandHandler(
    IApplicationDbContext context,
    IAdminUserService adminUserService)
    : IRequestHandler<TogglePublicTokenCommand, AdminPublicTokenDto>
{
    public async Task<AdminPublicTokenDto> Handle(TogglePublicTokenCommand request, CancellationToken ct)
    {
        var token = await context.PublicTokens
            .Include(pt => pt.Gem)
            .Include(pt => pt.GemParcel)
            .FirstOrDefaultAsync(pt => pt.Id == request.TokenId && !pt.IsDeleted, ct);

        if (token is null)
            throw new NotFoundException("PublicToken", request.TokenId);

        token.IsActive = !token.IsActive;
        await context.SaveChangesAsync(ct);

        var ownerId = token.Gem?.OwnerId ?? token.GemParcel?.OwnerId ?? Guid.Empty;
        var emailMap = await adminUserService.GetUserEmailMapAsync([ownerId], ct);

        return new AdminPublicTokenDto(
            token.Id,
            token.Token,
            token.IsActive,
            token.ScanCount,
            token.GemId,
            token.Gem?.Name,
            token.GemParcelId,
            token.GemParcel?.Name,
            ownerId,
            emailMap.GetValueOrDefault(ownerId, "(unknown)"),
            token.CreatedAt);
    }
}
