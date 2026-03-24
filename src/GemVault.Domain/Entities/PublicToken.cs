using GemVault.Domain.Common;

namespace GemVault.Domain.Entities;

public class PublicToken : BaseEntity
{
    public string Token { get; set; } = Guid.NewGuid().ToString("N");
    public Guid? GemId { get; set; }
    public Guid? GemParcelId { get; set; }
    public bool IsActive { get; set; } = true;

    public Gem? Gem { get; set; }
    public GemParcel? GemParcel { get; set; }
}
