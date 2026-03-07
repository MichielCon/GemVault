using GemVault.Application.Interfaces;
using System.Security.Claims;

namespace GemVault.Api.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public Guid? UserId
    {
        get
        {
            var claim = httpContextAccessor.HttpContext?.User
                .FindFirstValue(ClaimTypes.NameIdentifier)
                ?? httpContextAccessor.HttpContext?.User
                .FindFirstValue("sub");

            return Guid.TryParse(claim, out var id) ? id : null;
        }
    }

    public bool IsAuthenticated
        => httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated ?? false;
}
