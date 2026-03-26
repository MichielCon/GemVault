using GemVault.Domain.Common;

namespace GemVault.Domain.Entities;

public class GemDesignFile : BaseEntity
{
    public Guid GemId { get; set; }
    public Gem Gem { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
    public string ObjectKey { get; set; } = string.Empty;
    public string? ContentType { get; set; }
    public long FileSize { get; set; }
}
