namespace GemVault.Application.Suppliers.DTOs;

public record SupplierDto(Guid Id, string Name, string? Email, string? Phone, string? Website, string? Address, string? Notes, int OrderCount, DateTime CreatedAt);
