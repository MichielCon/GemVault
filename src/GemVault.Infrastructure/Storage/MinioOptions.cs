namespace GemVault.Infrastructure.Storage;

public class MinioOptions
{
    public string Endpoint { get; set; } = "minio:9000";
    /// <summary>
    /// Browser-accessible endpoint for public URLs. Falls back to Endpoint if not set.
    /// In Docker: set to "localhost:9000" so browsers can reach MinIO via the mapped port.
    /// </summary>
    public string PublicEndpoint { get; set; } = string.Empty;
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string BucketName { get; set; } = "gemvault-images";
    public bool UseSSL { get; set; }
}
