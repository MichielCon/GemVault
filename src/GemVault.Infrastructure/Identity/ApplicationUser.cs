using GemVault.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace GemVault.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public UserRole Role { get; set; } = UserRole.Collector;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; }
}
