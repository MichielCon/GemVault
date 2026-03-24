using GemVault.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace GemVault.Infrastructure.BackgroundServices;

public class RefreshTokenCleanupService(IServiceScopeFactory scopeFactory, ILogger<RefreshTokenCleanupService> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            using var scope = scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var cutoff = DateTime.UtcNow.AddDays(-7);
            var deleted = await context.Database.ExecuteSqlRawAsync(
                "DELETE FROM \"RefreshTokens\" WHERE \"IsRevoked\" = TRUE AND \"ExpiresAt\" < {0}", cutoff);
            logger.LogInformation("Cleaned up {Count} expired refresh tokens", deleted);
        }
    }
}
