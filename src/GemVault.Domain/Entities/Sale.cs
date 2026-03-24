using GemVault.Domain.Common;

namespace GemVault.Domain.Entities;

public class Sale : BaseEntity
{
    public DateTime SaleDate { get; set; }
    public string? BuyerName { get; set; }
    public string? BuyerEmail { get; set; }
    public string? BuyerPhone { get; set; }
    public Guid OwnerId { get; set; }
    public string? Notes { get; set; }

    public ICollection<SaleItem> Items { get; set; } = new List<SaleItem>();
}
