namespace GemVault.Domain.Interfaces;

public interface IStorageService
{
    Task<string> UploadAsync(string objectKey, Stream content, string contentType, long size, CancellationToken ct = default);
    Task DeleteAsync(string objectKey, CancellationToken ct = default);
    string GetPublicUrl(string objectKey);
    Task<bool> ExistsAsync(string objectKey, CancellationToken ct = default);
    Task<byte[]?> DownloadAsync(string objectKey, CancellationToken ct = default);
}
