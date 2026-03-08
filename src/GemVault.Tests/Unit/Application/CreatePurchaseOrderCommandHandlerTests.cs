using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.PurchaseOrders.Commands;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MockQueryable.Moq;
using Moq;

namespace GemVault.Tests.Unit.Application;

public class CreatePurchaseOrderCommandHandlerTests
{
    private static (Mock<IApplicationDbContext> ctx, Mock<ICurrentUserService> user) BuildMocks(
        Guid userId, Supplier supplier)
    {
        var ctxMock = new Mock<IApplicationDbContext>();
        var userMock = new Mock<ICurrentUserService>();

        userMock.Setup(u => u.UserId).Returns(userId);

        var suppliers = new List<Supplier> { supplier };
        ctxMock.Setup(c => c.Suppliers).Returns(suppliers.BuildMockDbSet().Object);

        var orders = new List<PurchaseOrder>();
        var orderSet = orders.BuildMockDbSet();
        ctxMock.Setup(c => c.PurchaseOrders).Returns(orderSet.Object);
        ctxMock.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        return (ctxMock, userMock);
    }

    [Fact]
    public async Task Handle_ValidCommand_CreatesOrderAndReturnsDto()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var supplierId = Guid.NewGuid();
        var supplier = new Supplier { Id = supplierId, Name = "Test Supplier", OwnerId = userId };

        var (ctxMock, userMock) = BuildMocks(userId, supplier);
        var handler = new CreatePurchaseOrderCommandHandler(ctxMock.Object, userMock.Object);

        var command = new CreatePurchaseOrderCommand(
            SupplierId: supplierId,
            Reference: "INV-001",
            OrderDate: new DateTime(2026, 3, 8),
            Notes: "Test notes",
            Items: new List<CreateOrderItemCommand>
            {
                new(GemId: null, GemParcelId: null, CostPrice: 150m, Notes: "Ruby rough")
            });

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(supplierId, result.SupplierId);
        Assert.Equal("Test Supplier", result.SupplierName);
        Assert.Equal("INV-001", result.Reference);
        Assert.Equal(150m, result.TotalCost);
        Assert.Single(result.Items);
        Assert.Equal(DateTimeKind.Utc, result.OrderDate.Kind);
        ctxMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_NoCurrentUser_ThrowsForbiddenException()
    {
        // Arrange
        var ctxMock = new Mock<IApplicationDbContext>();
        var userMock = new Mock<ICurrentUserService>();
        userMock.Setup(u => u.UserId).Returns((Guid?)null);

        var handler = new CreatePurchaseOrderCommandHandler(ctxMock.Object, userMock.Object);
        var command = new CreatePurchaseOrderCommand(
            Guid.NewGuid(), null, DateTime.UtcNow, null, new List<CreateOrderItemCommand>());

        // Act & Assert
        await Assert.ThrowsAsync<ForbiddenException>(() =>
            handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_SupplierOwnedByDifferentUser_ThrowsNotFoundException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();
        var supplierId = Guid.NewGuid();
        var supplier = new Supplier { Id = supplierId, Name = "Other Supplier", OwnerId = otherUserId };

        var (ctxMock, userMock) = BuildMocks(userId, supplier);
        var handler = new CreatePurchaseOrderCommandHandler(ctxMock.Object, userMock.Object);

        var command = new CreatePurchaseOrderCommand(
            supplierId, null, DateTime.UtcNow, null, new List<CreateOrderItemCommand>());

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_UnspecifiedDateTimeKind_SavesAsUtc()
    {
        // Arrange — this is the exact scenario from the date picker (Kind=Unspecified)
        var userId = Guid.NewGuid();
        var supplierId = Guid.NewGuid();
        var supplier = new Supplier { Id = supplierId, Name = "Supplier", OwnerId = userId };

        var (ctxMock, userMock) = BuildMocks(userId, supplier);
        var handler = new CreatePurchaseOrderCommandHandler(ctxMock.Object, userMock.Object);

        var unspecifiedDate = DateTime.SpecifyKind(new DateTime(2026, 3, 8), DateTimeKind.Unspecified);
        var command = new CreatePurchaseOrderCommand(
            supplierId, null, unspecifiedDate, null, new List<CreateOrderItemCommand>());

        // Act — should NOT throw (was throwing before the fix)
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(DateTimeKind.Utc, result.OrderDate.Kind);
    }

    [Fact]
    public async Task Handle_MultipleItems_TotalCostIsSumOfItems()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var supplierId = Guid.NewGuid();
        var supplier = new Supplier { Id = supplierId, Name = "Supplier", OwnerId = userId };

        var (ctxMock, userMock) = BuildMocks(userId, supplier);
        var handler = new CreatePurchaseOrderCommandHandler(ctxMock.Object, userMock.Object);

        var command = new CreatePurchaseOrderCommand(
            supplierId, null, DateTime.UtcNow, null,
            new List<CreateOrderItemCommand>
            {
                new(null, null, 100m, "Item 1"),
                new(null, null, 250m, "Item 2"),
                new(null, null, 50m, "Item 3"),
            });

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(3, result.Items.Count);
        Assert.Equal(400m, result.TotalCost);
    }
}
