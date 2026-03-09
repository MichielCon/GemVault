using GemVault.Domain.Common;

namespace GemVault.Domain.Entities;

public class Certificate : BaseEntity
{
    public string CertNumber { get; set; } = string.Empty;
    public string? Lab { get; set; }
    public string? Grade { get; set; }
    public DateTime? IssueDate { get; set; }
    public string? ObjectKey { get; set; }
    public Guid GemId { get; set; }

    public Gem? Gem { get; set; }
}
