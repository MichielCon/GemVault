using GemVault.Domain.Common;

namespace GemVault.Domain.Entities;

public class PurchaseOrder : BaseEntity
{
    public string? Reference { get; set; }
    public DateTime OrderDate { get; set; }
    public Guid SupplierId { get; set; }
    public Guid OwnerId { get; set; }
    public string? Notes { get; set; }

    public Supplier Supplier { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
