using GemVault.Domain.Common;

namespace GemVault.Domain.Entities;

public class OrderItem : BaseEntity
{
    public Guid PurchaseOrderId { get; set; }
    public Guid? GemId { get; set; }
    public Guid? GemParcelId { get; set; }
    public decimal CostPrice { get; set; }
    public string? Notes { get; set; }

    public PurchaseOrder PurchaseOrder { get; set; } = null!;
    public Gem? Gem { get; set; }
    public GemParcel? GemParcel { get; set; }
}
