using GemVault.Domain.Common;
using System.Security.Cryptography;

namespace GemVault.Domain.Entities;

public class PublicToken : BaseEntity
{
    public string Token { get; set; } = Convert.ToBase64String(RandomNumberGenerator.GetBytes(24))
        .Replace("+", "-").Replace("/", "_").Replace("=", "");
    public Guid? GemId { get; set; }
    public Guid? GemParcelId { get; set; }
    public bool IsActive { get; set; } = true;

    public Gem? Gem { get; set; }
    public GemParcel? GemParcel { get; set; }
}
