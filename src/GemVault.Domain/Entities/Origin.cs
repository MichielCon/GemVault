using GemVault.Domain.Common;

namespace GemVault.Domain.Entities;

public class Origin : BaseEntity
{
    public string Country { get; set; } = string.Empty;
    public string? Mine { get; set; }
    public string? Region { get; set; }

    public ICollection<Gem> Gems { get; set; } = new List<Gem>();
    public ICollection<GemParcel> GemParcels { get; set; } = new List<GemParcel>();
}
