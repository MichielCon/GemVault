using GemVault.Domain.Enums;

namespace GemVault.Domain.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(Guid userId, string email, UserRole role);
    string GenerateRefreshToken();
}
