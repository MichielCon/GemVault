using GemVault.Application.Common.Options;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using GemVault.Infrastructure.Identity;
using GemVault.Infrastructure.Persistence;
using GemVault.Infrastructure.Storage;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Minio;

namespace GemVault.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        // EF Core + PostgreSQL
        services.AddDbContext<ApplicationDbContext>(opts =>
            opts.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IApplicationDbContext>(sp =>
            sp.GetRequiredService<ApplicationDbContext>());

        // ASP.NET Identity
        services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(opts =>
        {
            opts.Password.RequireDigit = true;
            opts.Password.RequiredLength = 8;
            opts.Password.RequireUppercase = false;
            opts.Password.RequireNonAlphanumeric = false;
            opts.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        // JWT (single registration using Application's JwtOptions)
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IIdentityService, IdentityService>();

        // MinIO
        services.Configure<MinioOptions>(configuration.GetSection("Minio"));
        services.AddSingleton<IMinioClient>(sp =>
        {
            var opts = configuration.GetSection("Minio").Get<MinioOptions>()!;
            return new MinioClient()
                .WithEndpoint(opts.Endpoint)
                .WithCredentials(opts.AccessKey, opts.SecretKey)
                .WithSSL(opts.UseSSL)
                .Build();
        });
        services.AddScoped<IStorageService, MinioStorageService>();

        return services;
    }
}
