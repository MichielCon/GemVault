using GemVault.Domain.Entities;
using GemVault.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GemVault.Infrastructure.Persistence.Configurations;

public class GemConfiguration : IEntityTypeConfiguration<Gem>
{
    public void Configure(EntityTypeBuilder<Gem> builder)
    {
        builder.HasQueryFilter(g => !g.IsDeleted);

        builder.Property(g => g.Name).IsRequired().HasMaxLength(200);
        builder.Property(g => g.Species).HasMaxLength(100);
        builder.Property(g => g.Variety).HasMaxLength(100);
        builder.Property(g => g.Color).HasMaxLength(100);
        builder.Property(g => g.Clarity).HasMaxLength(100);
        builder.Property(g => g.Cut).HasMaxLength(100);
        builder.Property(g => g.Treatment).HasMaxLength(200);
        builder.Property(g => g.Shape).HasMaxLength(100);
        builder.Property(g => g.WeightCarats).HasPrecision(10, 4);
        builder.Property(g => g.PurchasePrice).HasPrecision(18, 2);
        builder.Property(g => g.CuttingDesign).HasMaxLength(200);
        builder.Property(g => g.AcquiredAt);
        builder.Property(g => g.LengthMm).HasPrecision(8, 2);
        builder.Property(g => g.WidthMm).HasPrecision(8, 2);
        builder.Property(g => g.HeightMm).HasPrecision(8, 2);

        // JSONB column
        builder.Property(g => g.Attributes).HasColumnType("jsonb");

        builder.Property(g => g.Status).HasConversion<string>().HasMaxLength(50);

        builder.HasOne(g => g.Origin)
            .WithMany(o => o.Gems)
            .HasForeignKey(g => g.OriginId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(g => g.PublicToken)
            .WithOne(t => t.Gem)
            .HasForeignKey<PublicToken>(t => t.GemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(g => g.SourceParcel)
            .WithMany()
            .HasForeignKey(g => g.SourceParcelId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(g => g.OwnerId);
        builder.HasIndex(g => g.IsDeleted);
    }
}

public class GemParcelConfiguration : IEntityTypeConfiguration<GemParcel>
{
    public void Configure(EntityTypeBuilder<GemParcel> builder)
    {
        builder.HasQueryFilter(g => !g.IsDeleted);

        builder.Property(g => g.Name).IsRequired().HasMaxLength(200);
        builder.Property(g => g.Species).HasMaxLength(100);
        builder.Property(g => g.Variety).HasMaxLength(100);
        builder.Property(g => g.Color).HasMaxLength(100);
        builder.Property(g => g.Treatment).HasMaxLength(200);
        builder.Property(g => g.TotalWeightCarats).HasPrecision(10, 4);
        builder.Property(g => g.PurchasePrice).HasPrecision(18, 2);
        builder.Property(g => g.AcquiredAt);

        builder.HasOne(g => g.Origin)
            .WithMany(o => o.GemParcels)
            .HasForeignKey(g => g.OriginId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(g => g.OwnerId);
    }
}

public class GemPhotoConfiguration : IEntityTypeConfiguration<GemPhoto>
{
    public void Configure(EntityTypeBuilder<GemPhoto> builder)
    {
        builder.HasQueryFilter(p => !p.IsDeleted);
        builder.Property(p => p.ObjectKey).IsRequired().HasMaxLength(500);
        builder.Property(p => p.FileName).HasMaxLength(255);
        builder.Property(p => p.ContentType).HasMaxLength(100);

        builder.HasOne(p => p.Gem)
            .WithMany(g => g.Photos)
            .HasForeignKey(p => p.GemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.GemParcel)
            .WithMany(g => g.Photos)
            .HasForeignKey(p => p.GemParcelId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class PublicTokenConfiguration : IEntityTypeConfiguration<PublicToken>
{
    public void Configure(EntityTypeBuilder<PublicToken> builder)
    {
        builder.Property(t => t.Token).IsRequired().HasMaxLength(64);
        builder.Property(t => t.ScanCount).HasDefaultValue(0);
        builder.HasIndex(t => t.Token).IsUnique();

        builder.HasOne(t => t.GemParcel)
            .WithOne(g => g.PublicToken)
            .HasForeignKey<PublicToken>(t => t.GemParcelId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class OriginConfiguration : IEntityTypeConfiguration<Origin>
{
    public void Configure(EntityTypeBuilder<Origin> builder)
    {
        builder.HasQueryFilter(o => !o.IsDeleted);
        builder.Property(o => o.Country).IsRequired().HasMaxLength(100);
        builder.Property(o => o.Locality).HasMaxLength(200);
        builder.HasIndex(o => new { o.Country, o.Locality }).IsUnique();
        builder.HasData(OriginSeedData.GetAll());
    }
}

public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
{
    public void Configure(EntityTypeBuilder<Supplier> builder)
    {
        builder.HasQueryFilter(s => !s.IsDeleted);
        builder.Property(s => s.Name).IsRequired().HasMaxLength(200);
        builder.Property(s => s.Email).HasMaxLength(200);
        builder.Property(s => s.Phone).HasMaxLength(50);
        builder.Property(s => s.Website).HasMaxLength(500);
        builder.HasIndex(s => s.OwnerId);
    }
}

public class CertificateConfiguration : IEntityTypeConfiguration<Certificate>
{
    public void Configure(EntityTypeBuilder<Certificate> builder)
    {
        builder.HasQueryFilter(c => !c.IsDeleted);
        builder.Property(c => c.CertNumber).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Lab).HasMaxLength(100);
        builder.Property(c => c.Grade).HasMaxLength(50);
        builder.Property(c => c.ObjectKey).HasMaxLength(500);

        builder.HasOne(c => c.Gem)
            .WithMany(g => g.Certificates)
            .HasForeignKey(c => c.GemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<Domain.Entities.RefreshToken>
{
    public void Configure(EntityTypeBuilder<Domain.Entities.RefreshToken> builder)
    {
        builder.HasQueryFilter(t => !t.IsDeleted);
        builder.Property(t => t.TokenHash).IsRequired().HasMaxLength(64);
        builder.HasIndex(t => t.TokenHash).IsUnique();
        builder.HasIndex(t => t.UserId);
        builder.HasIndex(t => new { t.UserId, t.ExpiresAt });
    }
}

public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
{
    public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
    {
        builder.HasQueryFilter(o => !o.IsDeleted);
        builder.Property(o => o.Reference).HasMaxLength(100);

        builder.Property(o => o.BoughtFrom).HasMaxLength(200);

        builder.HasOne(o => o.Supplier)
            .WithMany(s => s.PurchaseOrders)
            .HasForeignKey(o => o.SupplierId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(o => o.OwnerId);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasQueryFilter(i => !i.IsDeleted);
        builder.Property(i => i.CostPrice).HasPrecision(18, 2);

        builder.HasOne(i => i.Gem)
            .WithMany(g => g.OrderItems)
            .HasForeignKey(i => i.GemId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(i => i.GemParcel)
            .WithMany(g => g.OrderItems)
            .HasForeignKey(i => i.GemParcelId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class SaleConfiguration : IEntityTypeConfiguration<Sale>
{
    public void Configure(EntityTypeBuilder<Sale> builder)
    {
        builder.HasQueryFilter(s => !s.IsDeleted);
        builder.Property(s => s.BuyerName).HasMaxLength(200);
        builder.Property(s => s.BuyerEmail).HasMaxLength(200);
        builder.Property(s => s.BuyerPhone).HasMaxLength(50);
        builder.HasIndex(s => s.OwnerId);
    }
}

public class SaleItemConfiguration : IEntityTypeConfiguration<SaleItem>
{
    public void Configure(EntityTypeBuilder<SaleItem> builder)
    {
        builder.HasQueryFilter(i => !i.IsDeleted);
        builder.Property(i => i.SalePrice).HasPrecision(18, 2);

        builder.HasOne(i => i.Gem)
            .WithMany(g => g.SaleItems)
            .HasForeignKey(i => i.GemId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(i => i.GemParcel)
            .WithMany(g => g.SaleItems)
            .HasForeignKey(i => i.GemParcelId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class GemDesignFileConfiguration : IEntityTypeConfiguration<GemDesignFile>
{
    public void Configure(EntityTypeBuilder<GemDesignFile> builder)
    {
        builder.HasQueryFilter(f => !f.IsDeleted);
        builder.Property(f => f.FileName).IsRequired().HasMaxLength(500);
        builder.Property(f => f.ObjectKey).IsRequired().HasMaxLength(500);
        builder.Property(f => f.ContentType).HasMaxLength(200);

        builder.HasOne(f => f.Gem)
            .WithMany(g => g.DesignFiles)
            .HasForeignKey(f => f.GemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(f => f.GemId);
    }
}

public class GemCuttingSessionConfiguration : IEntityTypeConfiguration<GemCuttingSession>
{
    public void Configure(EntityTypeBuilder<GemCuttingSession> builder)
    {
        builder.HasQueryFilter(s => !s.IsDeleted);
        builder.Property(s => s.Stage).HasConversion<string>().HasMaxLength(50);
        builder.Property(s => s.HoursSpent).HasPrecision(6, 2);
        builder.Property(s => s.Notes).HasMaxLength(2000);

        builder.HasOne(s => s.Gem)
            .WithMany(g => g.CuttingSessions)
            .HasForeignKey(s => s.GemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(s => s.GemId);
    }
}

public class GemVocabularyConfiguration : IEntityTypeConfiguration<GemVocabulary>
{
    public void Configure(EntityTypeBuilder<GemVocabulary> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Field).HasMaxLength(50).IsRequired();
        builder.Property(x => x.Value).HasMaxLength(200).IsRequired();
        builder.Property(x => x.ParentValue).HasMaxLength(200);
        builder.HasIndex(x => new { x.Field, x.Value }).IsUnique();
    }
}
