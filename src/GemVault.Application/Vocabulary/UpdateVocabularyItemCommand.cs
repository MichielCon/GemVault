using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Vocabulary;

public record UpdateVocabularyItemCommand(
    int Id,
    string Value,
    string? ParentValue,
    int SortOrder) : IRequest<VocabularyAdminDto>;

public class UpdateVocabularyItemCommandValidator : AbstractValidator<UpdateVocabularyItemCommand>
{
    public UpdateVocabularyItemCommandValidator()
    {
        RuleFor(x => x.Value).NotEmpty().MaximumLength(100);
    }
}

public class UpdateVocabularyItemCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<UpdateVocabularyItemCommand, VocabularyAdminDto>
{
    public async Task<VocabularyAdminDto> Handle(UpdateVocabularyItemCommand request, CancellationToken ct)
    {
        if (currentUser.Role != "Admin")
            throw new ForbiddenException();

        var item = await context.GemVocabularies.FindAsync([request.Id], ct)
            ?? throw new KeyNotFoundException($"Vocabulary item {request.Id} not found.");

        // Check for duplicate (same field + new value, excluding self)
        var duplicate = await context.GemVocabularies
            .AnyAsync(v => v.Field == item.Field && v.Value == request.Value && v.Id != request.Id, ct);
        if (duplicate)
            throw new Common.Exceptions.ValidationException($"A vocabulary entry with value '{request.Value}' already exists in field '{item.Field}'.");

        item.Value = request.Value;
        item.ParentValue = request.ParentValue;
        item.SortOrder = request.SortOrder;

        await context.SaveChangesAsync(ct);

        return new VocabularyAdminDto(item.Id, item.Field, item.Value, item.ParentValue, item.SortOrder);
    }
}
