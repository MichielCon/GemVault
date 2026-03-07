using GemVault.Domain.Entities;

namespace GemVault.Domain.Interfaces;

/// <summary>
/// Shared interface for Gem and GemParcel — enables polymorphic operations
/// (public scan, photo upload, order items, sale items) across both types.
/// </summary>
public interface IGemRecord
{
    Guid Id { get; }
    string Name { get; }
    string? Species { get; }
    string? Variety { get; }
    string? Color { get; }
    string? Treatment { get; }
    string? Notes { get; }
    bool IsPublic { get; }
    Guid OwnerId { get; }
    Guid? OriginId { get; }

    Origin? Origin { get; }
    ICollection<GemPhoto> Photos { get; }
    PublicToken? PublicToken { get; }
}
