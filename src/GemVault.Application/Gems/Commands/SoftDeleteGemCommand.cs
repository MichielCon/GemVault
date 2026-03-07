using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Gems.Commands;

public record SoftDeleteGemCommand(Guid GemId) : IRequest;

public class SoftDeleteGemCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<SoftDeleteGemCommand>
{
    public async Task Handle(SoftDeleteGemCommand request, CancellationToken ct)
    {
        var gem = await context.Gems
            .FirstOrDefaultAsync(g => g.Id == request.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", request.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        gem.IsDeleted = true;
        await context.SaveChangesAsync(ct);
    }
}
