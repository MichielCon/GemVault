using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;

namespace GemVault.Application.Vocabulary;

public record DeleteVocabularyItemCommand(int Id) : IRequest;

public class DeleteVocabularyItemCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<DeleteVocabularyItemCommand>
{
    public async Task Handle(DeleteVocabularyItemCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new ForbiddenException();

        var item = await context.GemVocabularies.FindAsync([request.Id], ct)
            ?? throw new KeyNotFoundException($"Vocabulary item {request.Id} not found.");

        context.GemVocabularies.Remove(item);
        await context.SaveChangesAsync(ct);
    }
}
