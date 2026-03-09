using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Vocabulary;

public record GetVocabularyAdminQuery(string Field) : IRequest<List<VocabularyAdminDto>>;

public class GetVocabularyAdminQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetVocabularyAdminQuery, List<VocabularyAdminDto>>
{
    public async Task<List<VocabularyAdminDto>> Handle(GetVocabularyAdminQuery request, CancellationToken ct)
    {
        var field = request.Field.ToLowerInvariant();
        var items = await context.GemVocabularies
            .Where(v => v.Field == field)
            .OrderBy(v => v.SortOrder)
            .Select(v => new VocabularyAdminDto(v.Id, v.Field, v.Value, v.ParentValue, v.SortOrder))
            .ToListAsync(ct);
        return items;
    }
}

public record VocabularyItemDto(string Value, string? ParentValue);

public record GetVocabularyQuery(string Field, Guid? UserId, string? ParentValue = null) : IRequest<List<VocabularyItemDto>>;

public class GetVocabularyQueryHandler(IApplicationDbContext context) : IRequestHandler<GetVocabularyQuery, List<VocabularyItemDto>>
{
    public async Task<List<VocabularyItemDto>> Handle(GetVocabularyQuery request, CancellationToken ct)
    {
        var field = request.Field.ToLowerInvariant();

        // Build usage map if user is authenticated
        Dictionary<string, int> usageMap = new();
        if (request.UserId.HasValue)
        {
            var userId = request.UserId.Value;
            var usedValues = field switch
            {
                "species" => await context.Gems.Where(g => g.OwnerId == userId && !g.IsDeleted).Select(g => g.Species)
                    .Concat(context.GemParcels.Where(p => p.OwnerId == userId && !p.IsDeleted).Select(p => p.Species))
                    .Where(v => v != null).Cast<string>().ToListAsync(ct),
                "variety" => await context.Gems.Where(g => g.OwnerId == userId && !g.IsDeleted).Select(g => g.Variety)
                    .Concat(context.GemParcels.Where(p => p.OwnerId == userId && !p.IsDeleted).Select(p => p.Variety))
                    .Where(v => v != null).Cast<string>().ToListAsync(ct),
                "color" => await context.Gems.Where(g => g.OwnerId == userId && !g.IsDeleted).Select(g => g.Color)
                    .Concat(context.GemParcels.Where(p => p.OwnerId == userId && !p.IsDeleted).Select(p => p.Color))
                    .Where(v => v != null).Cast<string>().ToListAsync(ct),
                "clarity" => await context.Gems.Where(g => g.OwnerId == userId && !g.IsDeleted).Select(g => g.Clarity)
                    .Where(v => v != null).Cast<string>().ToListAsync(ct),
                "cut" => await context.Gems.Where(g => g.OwnerId == userId && !g.IsDeleted).Select(g => g.Cut)
                    .Where(v => v != null).Cast<string>().ToListAsync(ct),
                "shape" => await context.Gems.Where(g => g.OwnerId == userId && !g.IsDeleted).Select(g => g.Shape)
                    .Where(v => v != null).Cast<string>().ToListAsync(ct),
                "treatment" => await context.Gems.Where(g => g.OwnerId == userId && !g.IsDeleted).Select(g => g.Treatment)
                    .Concat(context.GemParcels.Where(p => p.OwnerId == userId && !p.IsDeleted).Select(p => p.Treatment))
                    .Where(v => v != null).Cast<string>().ToListAsync(ct),
                _ => new List<string>()
            };
            usageMap = usedValues.GroupBy(v => v, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(g => g.Key, g => g.Count(), StringComparer.OrdinalIgnoreCase);
        }

        var query = context.GemVocabularies.Where(v => v.Field == field);
        if (request.ParentValue is not null)
            query = query.Where(v => v.ParentValue == request.ParentValue);

        var vocab = await query.OrderBy(v => v.SortOrder).ToListAsync(ct);

        return vocab
            .OrderByDescending(v => usageMap.GetValueOrDefault(v.Value, 0))
            .ThenBy(v => v.SortOrder)
            .Select(v => new VocabularyItemDto(v.Value, v.ParentValue))
            .ToList();
    }
}
