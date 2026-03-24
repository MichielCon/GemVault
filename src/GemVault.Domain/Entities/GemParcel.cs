using GemVault.Domain.Common;
using GemVault.Domain.Interfaces;

namespace GemVault.Domain.Entities;

public class GemParcel : BaseEntity, IGemRecord
{
    public string Name { get; set; } = string.Empty;
    public string? Species { get; set; }
    public string? Variety { get; set; }
    public int Quantity { get; set; }
    public decimal? TotalWeightCarats { get; set; }
    public string? Color { get; set; }
    public string? Treatment { get; set; }
    public decimal? PurchasePrice { get; set; }
    public DateTime? AcquiredAt { get; set; }
    public string? Notes { get; set; }
    public bool IsPublic { get; set; }
    public Guid OwnerId { get; set; }
    public Guid? OriginId { get; set; }

    public Origin? Origin { get; set; }
    public ICollection<GemPhoto> Photos { get; set; } = new List<GemPhoto>();
    public PublicToken? PublicToken { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
}
