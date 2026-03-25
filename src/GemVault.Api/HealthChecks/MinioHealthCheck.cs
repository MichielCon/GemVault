using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace GemVault.Api.HealthChecks;

public class MinioHealthCheck(IConfiguration configuration) : IHealthCheck
{
    private static readonly HttpClient _client = new() { Timeout = TimeSpan.FromSeconds(3) };

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var endpoint = configuration["Minio:Endpoint"] ?? "minio:9000";
        var url = $"http://{endpoint.TrimEnd('/')}/minio/health/live";

        try
        {
            var response = await _client.GetAsync(url, cancellationToken);
            return response.IsSuccessStatusCode
                ? HealthCheckResult.Healthy()
                : HealthCheckResult.Unhealthy($"MinIO returned {(int)response.StatusCode}");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy(ex.Message);
        }
    }
}
