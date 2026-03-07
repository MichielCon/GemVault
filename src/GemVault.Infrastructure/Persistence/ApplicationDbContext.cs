using GemVault.Application.Interfaces;
using GemVault.Domain.Common;
using GemVault.Domain.Entities;
using GemVault.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace GemVault.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options), IApplicationDbContext
{
    public DbSet<Gem> Gems => Set<Gem>();
    public DbSet<GemParcel> GemParcels => Set<GemParcel>();
    public DbSet<GemPhoto> GemPhotos => Set<GemPhoto>();
    public DbSet<Origin> Origins => Set<Origin>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<PublicToken> PublicTokens => Set<PublicToken>();
    public DbSet<Certificate> Certificates => Set<Certificate>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Sale> Sales => Set<Sale>();
    public DbSet<SaleItem> SaleItems => Set<SaleItem>();
    public DbSet<GemVocabulary> GemVocabularies => Set<GemVocabulary>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        return base.SaveChangesAsync(ct);
    }
}
