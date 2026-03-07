using GemVault.Domain.Common;

namespace GemVault.Domain.Entities;

public class SaleItem : BaseEntity
{
    public Guid SaleId { get; set; }
    public Guid? GemId { get; set; }
    public Guid? GemParcelId { get; set; }
    public int Quantity { get; set; } = 1;
    public decimal SalePrice { get; set; }

    public Sale Sale { get; set; } = null!;
    public Gem? Gem { get; set; }
    public GemParcel? GemParcel { get; set; }
}
