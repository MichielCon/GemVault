using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Sales.Commands;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MockQueryable.Moq;
using Moq;

namespace GemVault.Tests.Unit.Application;

public class CreateSaleCommandHandlerTests
{
    private static (Mock<IApplicationDbContext> ctx, Mock<ICurrentUserService> user) BuildMocks(Guid userId)
    {
        var ctxMock = new Mock<IApplicationDbContext>();
        var userMock = new Mock<ICurrentUserService>();

        userMock.Setup(u => u.UserId).Returns(userId);

        var sales = new List<Sale>();
        var saleSet = sales.BuildMockDbSet();
        ctxMock.Setup(c => c.Sales).Returns(saleSet.Object);
        ctxMock.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        return (ctxMock, userMock);
    }

    [Fact]
    public async Task Handle_ValidCommand_CreatesSaleAndReturnsDto()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var (ctxMock, userMock) = BuildMocks(userId);
        var handler = new CreateSaleCommandHandler(ctxMock.Object, userMock.Object);

        var command = new CreateSaleCommand(
            SaleDate: new DateTime(2026, 3, 8),
            BuyerName: "Jane Smith",
            BuyerEmail: "jane@example.com",
            BuyerPhone: null,
            Notes: "Cash sale",
            Items: new List<CreateSaleItemCommand>
            {
                new(GemId: null, GemParcelId: null, Quantity: 1, SalePrice: 500m)
            });

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal("Jane Smith", result.BuyerName);
        Assert.Equal("jane@example.com", result.BuyerEmail);
        Assert.Equal(500m, result.TotalSaleValue);
        Assert.Single(result.Items);
        Assert.Equal(DateTimeKind.Utc, result.SaleDate.Kind);
        ctxMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_NoCurrentUser_ThrowsForbiddenException()
    {
        // Arrange
        var ctxMock = new Mock<IApplicationDbContext>();
        var userMock = new Mock<ICurrentUserService>();
        userMock.Setup(u => u.UserId).Returns((Guid?)null);

        var handler = new CreateSaleCommandHandler(ctxMock.Object, userMock.Object);
        var command = new CreateSaleCommand(
            DateTime.UtcNow, null, null, null, null, new List<CreateSaleItemCommand>());

        // Act & Assert
        await Assert.ThrowsAsync<ForbiddenException>(() =>
            handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_UnspecifiedDateTimeKind_SavesAsUtc()
    {
        // Arrange — simulates the date picker sending "2026-03-08" (Kind=Unspecified)
        var userId = Guid.NewGuid();
        var (ctxMock, userMock) = BuildMocks(userId);
        var handler = new CreateSaleCommandHandler(ctxMock.Object, userMock.Object);

        var unspecifiedDate = DateTime.SpecifyKind(new DateTime(2026, 3, 8), DateTimeKind.Unspecified);
        var command = new CreateSaleCommand(
            unspecifiedDate, null, null, null, null, new List<CreateSaleItemCommand>());

        // Act — should NOT throw (was throwing before the fix)
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(DateTimeKind.Utc, result.SaleDate.Kind);
    }

    [Fact]
    public async Task Handle_MultipleItems_TotalSaleValueIsSumOfPriceTimesQty()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var (ctxMock, userMock) = BuildMocks(userId);
        var handler = new CreateSaleCommandHandler(ctxMock.Object, userMock.Object);

        var command = new CreateSaleCommand(
            DateTime.UtcNow, null, null, null, null,
            new List<CreateSaleItemCommand>
            {
                new(null, null, Quantity: 2, SalePrice: 100m),  // 200
                new(null, null, Quantity: 1, SalePrice: 300m),  // 300
            });

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(2, result.Items.Count);
        Assert.Equal(500m, result.TotalSaleValue);
    }
}
