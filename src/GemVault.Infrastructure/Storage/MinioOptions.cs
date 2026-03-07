namespace GemVault.Infrastructure.Storage;

public class MinioOptions
{
    public string Endpoint { get; set; } = "minio:9000";
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string BucketName { get; set; } = "gemvault-images";
    public bool UseSSL { get; set; }
}
