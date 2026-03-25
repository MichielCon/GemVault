using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Sales.Commands;

public record DeleteSaleCommand(Guid Id) : IRequest;

public class DeleteSaleCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<DeleteSaleCommand>
{
    public async Task Handle(DeleteSaleCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var sale = await context.Sales
            .FirstOrDefaultAsync(s => s.Id == request.Id && !s.IsDeleted, ct)
            ?? throw new NotFoundException("Sale", request.Id);

        if (sale.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        sale.IsDeleted = true;
        sale.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
    }
}
