using GemVault.Domain.Common;
using GemVault.Domain.Enums;
using GemVault.Domain.Interfaces;

namespace GemVault.Domain.Entities;

public class Gem : BaseEntity, IGemRecord
{
    public string Name { get; set; } = string.Empty;
    public string? Species { get; set; }
    public string? Variety { get; set; }
    public decimal? WeightCarats { get; set; }
    public string? Color { get; set; }
    public string? Clarity { get; set; }
    public string? Cut { get; set; }
    public string? Treatment { get; set; }
    public string? Shape { get; set; }
    public decimal? LengthMm { get; set; }
    public decimal? WidthMm { get; set; }
    public decimal? HeightMm { get; set; }
    public decimal? PurchasePrice { get; set; }
    public DateTime? AcquiredAt { get; set; }
    public string? Notes { get; set; }
    public bool IsPublic { get; set; }
    public Guid OwnerId { get; set; }
    public Guid? OriginId { get; set; }
    public string? Attributes { get; set; } // JSONB — flexible gem-type-specific data
    public GemStatus Status { get; set; } = GemStatus.Available;

    public Guid? SourceParcelId { get; set; }
    public decimal? RoughWeightCarats { get; set; }
    public string? CutPlanNotes { get; set; }

    // Consignment tracking — populated when Status = OnConsignment
    public string? ConsigneeName { get; set; }
    public string? ConsigneeContact { get; set; }
    public decimal? ConsignmentTargetPrice { get; set; }
    public DateOnly? ConsignmentDate { get; set; }
    public DateOnly? ConsignmentReturnDate { get; set; }

    // Cutting design reference
    public string? CuttingDesign { get; set; }
    public int? PlannedFacets { get; set; }

    public Origin? Origin { get; set; }
    public GemParcel? SourceParcel { get; set; }
    public ICollection<GemPhoto> Photos { get; set; } = new List<GemPhoto>();
    public PublicToken? PublicToken { get; set; }
    public ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
    public ICollection<GemDesignFile> DesignFiles { get; set; } = new List<GemDesignFile>();
    public ICollection<GemCuttingSession> CuttingSessions { get; set; } = new List<GemCuttingSession>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
}
