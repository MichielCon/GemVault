using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Vocabulary;

public record VocabularyAdminDto(int Id, string Field, string Value, string? ParentValue, int SortOrder);

public record CreateVocabularyItemCommand(
    string Field,
    string Value,
    string? ParentValue,
    int SortOrder) : IRequest<VocabularyAdminDto>;

public class CreateVocabularyItemCommandValidator : AbstractValidator<CreateVocabularyItemCommand>
{
    private static readonly string[] ValidFields =
        ["species", "variety", "color", "clarity", "cut", "shape", "treatment"];

    public CreateVocabularyItemCommandValidator()
    {
        RuleFor(x => x.Field)
            .NotEmpty()
            .Must(f => ValidFields.Contains(f.ToLowerInvariant()))
            .WithMessage("Field must be one of: species, variety, color, clarity, cut, shape, treatment.");

        RuleFor(x => x.Value).NotEmpty().MaximumLength(100);

        RuleFor(x => x.ParentValue)
            .NotEmpty()
            .WithMessage("ParentValue is required for variety.")
            .When(x => x.Field?.ToLowerInvariant() == "variety");
    }
}

public class CreateVocabularyItemCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<CreateVocabularyItemCommand, VocabularyAdminDto>
{
    public async Task<VocabularyAdminDto> Handle(CreateVocabularyItemCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new ForbiddenException();

        var field = request.Field.ToLowerInvariant();

        var duplicate = await context.GemVocabularies
            .AnyAsync(v => v.Field == field && v.Value == request.Value, ct);
        if (duplicate)
            throw new Common.Exceptions.ValidationException($"A vocabulary entry with value '{request.Value}' already exists in field '{field}'.");

        var item = new GemVocabulary
        {
            Field = field,
            Value = request.Value,
            ParentValue = request.ParentValue,
            SortOrder = request.SortOrder,
        };

        context.GemVocabularies.Add(item);
        await context.SaveChangesAsync(ct);

        return new VocabularyAdminDto(item.Id, item.Field, item.Value, item.ParentValue, item.SortOrder);
    }
}
