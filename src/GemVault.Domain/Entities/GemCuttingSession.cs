using GemVault.Domain.Common;
using GemVault.Domain.Enums;

namespace GemVault.Domain.Entities;

public class GemCuttingSession : BaseEntity
{
    public Guid GemId { get; set; }
    public Gem Gem { get; set; } = null!;
    public DateTime SessionDate { get; set; }
    public CuttingStage Stage { get; set; }
    public decimal? HoursSpent { get; set; }
    public string? Notes { get; set; }
}
