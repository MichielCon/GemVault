using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Gems.Commands;

public record BulkDeleteGemsCommand(List<Guid> GemIds) : IRequest;

public class BulkDeleteGemsCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<BulkDeleteGemsCommand>
{
    public async Task Handle(BulkDeleteGemsCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var userId = currentUser.UserId.Value;

        var gems = await context.Gems
            .Where(g => request.GemIds.Contains(g.Id) && g.OwnerId == userId && !g.IsDeleted)
            .ToListAsync(ct);

        foreach (var gem in gems)
            gem.IsDeleted = true;

        await context.SaveChangesAsync(ct);
    }
}
