using GemVault.Application.Common.Options;
using GemVault.Domain.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Minio;
using Moq;
using System.Text;

namespace GemVault.Tests.Integration.Infrastructure;

public class GemVaultWebApplicationFactory(string connectionString)
    : WebApplicationFactory<Program>
{
    // A fixed secret used for both token generation (JwtOptions) and validation (JwtBearerOptions).
    // PostConfigure guarantees it overrides whatever Program.cs wired up at startup.
    private const string TestJwtSecret = "integration-test-secret-must-be-32-chars!!";
    private const string TestJwtIssuer = "GemVault";
    private const string TestJwtAudience = "GemVaultClient";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, config) =>
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = connectionString,
                ["Jwt:Secret"] = TestJwtSecret,
                ["Jwt:Issuer"] = TestJwtIssuer,
                ["Jwt:Audience"] = TestJwtAudience,
                ["Jwt:ExpiryMinutes"] = "60",
                ["Minio:Endpoint"] = "localhost:9000",
                ["Minio:AccessKey"] = "test",
                ["Minio:SecretKey"] = "testpassword",
                ["Minio:BucketName"] = "test-bucket",
                ["Minio:UseSSL"] = "false",
            }));

        builder.ConfigureServices(services =>
        {
            // PostConfigure runs AFTER Program.cs's AddJwtBearer, so we safely override
            // the signing key regardless of configuration override timing.
            services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, opts =>
            {
                opts.TokenValidationParameters.IssuerSigningKey =
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TestJwtSecret));
                opts.TokenValidationParameters.ValidIssuer = TestJwtIssuer;
                opts.TokenValidationParameters.ValidAudience = TestJwtAudience;
            });

            // PostConfigure for JwtOptions (used by JwtService to generate tokens)
            services.PostConfigure<JwtOptions>(opts =>
            {
                opts.Secret = TestJwtSecret;
                opts.Issuer = TestJwtIssuer;
                opts.Audience = TestJwtAudience;
            });

            // Replace IMinioClient (singleton lambda) to avoid connection refused on startup
            var minioDescs = services.Where(d => d.ServiceType == typeof(IMinioClient)).ToList();
            foreach (var d in minioDescs) services.Remove(d);
            services.AddSingleton<IMinioClient>(_ => Mock.Of<IMinioClient>());

            // Replace IStorageService with a deterministic fake
            var storageDescs = services.Where(d => d.ServiceType == typeof(IStorageService)).ToList();
            foreach (var d in storageDescs) services.Remove(d);

            var storageMock = new Mock<IStorageService>();
            storageMock
                .Setup(s => s.UploadAsync(
                    It.IsAny<string>(), It.IsAny<Stream>(),
                    It.IsAny<string>(), It.IsAny<long>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((string key, Stream _, string __, long ___, CancellationToken ____) => key);
            storageMock
                .Setup(s => s.GetPublicUrl(It.IsAny<string>()))
                .Returns((string key) => $"http://fake-storage/{key}");
            storageMock
                .Setup(s => s.ExistsAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            services.AddScoped<IStorageService>(_ => storageMock.Object);
        });
    }
}
