using GemVault.Domain.Interfaces;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace GemVault.Infrastructure.Storage;

public class MinioStorageService(IMinioClient minioClient, IOptions<MinioOptions> options)
    : IStorageService
{
    private readonly MinioOptions _opts = options.Value;

    public async Task<string> UploadAsync(
        string objectKey, Stream content, string contentType, long size, CancellationToken ct = default)
    {
        await EnsureBucketExistsAsync(ct);

        var args = new PutObjectArgs()
            .WithBucket(_opts.BucketName)
            .WithObject(objectKey)
            .WithStreamData(content)
            .WithObjectSize(size)
            .WithContentType(contentType);

        await minioClient.PutObjectAsync(args, ct);
        return objectKey;
    }

    public async Task DeleteAsync(string objectKey, CancellationToken ct = default)
    {
        var args = new RemoveObjectArgs()
            .WithBucket(_opts.BucketName)
            .WithObject(objectKey);
        await minioClient.RemoveObjectAsync(args, ct);
    }

    public string GetPublicUrl(string objectKey)
    {
        var scheme = _opts.UseSSL ? "https" : "http";
        return $"{scheme}://{_opts.Endpoint}/{_opts.BucketName}/{objectKey}";
    }

    public async Task<bool> ExistsAsync(string objectKey, CancellationToken ct = default)
    {
        try
        {
            var args = new StatObjectArgs()
                .WithBucket(_opts.BucketName)
                .WithObject(objectKey);
            await minioClient.StatObjectAsync(args, ct);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private async Task EnsureBucketExistsAsync(CancellationToken ct)
    {
        var exists = await minioClient.BucketExistsAsync(
            new BucketExistsArgs().WithBucket(_opts.BucketName), ct);

        if (!exists)
            await minioClient.MakeBucketAsync(
                new MakeBucketArgs().WithBucket(_opts.BucketName), ct);
    }
}
