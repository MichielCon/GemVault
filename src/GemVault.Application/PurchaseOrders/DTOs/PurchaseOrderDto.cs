namespace GemVault.Application.PurchaseOrders.DTOs;

public record OrderItemDto(Guid Id, Guid? GemId, string? GemName, Guid? GemParcelId, string? GemParcelName, decimal CostPrice, string? Notes);

public record PurchaseOrderDto(Guid Id, string? Reference, DateTime OrderDate, Guid SupplierId, string SupplierName, string? Notes, List<OrderItemDto> Items, decimal TotalCost, DateTime CreatedAt);

public record PurchaseOrderSummaryDto(Guid Id, string? Reference, DateTime OrderDate, string SupplierName, decimal TotalCost, int ItemCount, DateTime CreatedAt);
