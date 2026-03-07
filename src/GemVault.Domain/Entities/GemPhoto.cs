using GemVault.Domain.Common;

namespace GemVault.Domain.Entities;

public class GemPhoto : BaseEntity
{
    public Guid? GemId { get; set; }
    public Guid? GemParcelId { get; set; }
    public string ObjectKey { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public bool IsCover { get; set; }

    public Gem? Gem { get; set; }
    public GemParcel? GemParcel { get; set; }
}
