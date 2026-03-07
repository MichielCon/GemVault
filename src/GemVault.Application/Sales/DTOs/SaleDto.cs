namespace GemVault.Application.Sales.DTOs;

public record SaleItemDto(Guid Id, Guid? GemId, string? GemName, Guid? GemParcelId, string? GemParcelName, int Quantity, decimal SalePrice);

public record SaleDto(Guid Id, DateTime SaleDate, string? BuyerName, string? BuyerEmail, string? Notes, List<SaleItemDto> Items, decimal TotalSaleValue, DateTime CreatedAt);

public record SaleSummaryDto(Guid Id, DateTime SaleDate, string? BuyerName, decimal TotalSaleValue, int ItemCount, DateTime CreatedAt);
