using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.DesignFiles;

public record DeleteDesignFileCommand(Guid DesignFileId) : IRequest;

public class DeleteDesignFileCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<DeleteDesignFileCommand>
{
    public async Task Handle(DeleteDesignFileCommand request, CancellationToken ct)
    {
        var file = await context.DesignFiles
            .FirstOrDefaultAsync(f => f.Id == request.DesignFileId && !f.IsDeleted, ct)
            ?? throw new NotFoundException("DesignFile", request.DesignFileId);

        var gem = await context.Gems
            .FirstOrDefaultAsync(g => g.Id == file.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", file.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        await storage.DeleteAsync(file.ObjectKey, ct);

        file.IsDeleted = true;
        await context.SaveChangesAsync(ct);
    }
}
