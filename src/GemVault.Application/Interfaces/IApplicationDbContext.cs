using GemVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Gem> Gems { get; }
    DbSet<GemParcel> GemParcels { get; }
    DbSet<GemPhoto> GemPhotos { get; }
    DbSet<Origin> Origins { get; }
    DbSet<Supplier> Suppliers { get; }
    DbSet<PublicToken> PublicTokens { get; }
    DbSet<Certificate> Certificates { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<PurchaseOrder> PurchaseOrders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Sale> Sales { get; }
    DbSet<SaleItem> SaleItems { get; }
    DbSet<GemVault.Domain.Entities.GemVocabulary> GemVocabularies { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
