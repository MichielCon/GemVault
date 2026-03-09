using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Origins.Commands;

public record DeleteOriginCommand(Guid Id) : IRequest;

public class DeleteOriginCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<DeleteOriginCommand>
{
    public async Task Handle(DeleteOriginCommand request, CancellationToken ct)
    {
        if (currentUser.Role != "Admin")
            throw new ForbiddenException("Only administrators can delete origins.");

        var origin = await context.Origins
            .FirstOrDefaultAsync(o => o.Id == request.Id, ct)
            ?? throw new NotFoundException("Origin", request.Id);

        origin.IsDeleted = true;
        await context.SaveChangesAsync(ct);
    }
}
