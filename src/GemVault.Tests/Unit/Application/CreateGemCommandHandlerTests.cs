using GemVault.Application.Common.Exceptions;
using GemVault.Application.Gems.Commands;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MockQueryable.Moq;
using Moq;

namespace GemVault.Tests.Unit.Application;

public class CreateGemCommandHandlerTests
{
    private static CreateGemCommand MakeCommand(string name = "Sapphire") => new(
        Name: name,
        Species: null,
        Variety: null,
        WeightCarats: null,
        Color: null,
        Clarity: null,
        Cut: null,
        Treatment: null,
        Shape: null,
        LengthMm: null,
        WidthMm: null,
        HeightMm: null,
        PurchasePrice: null,
        AcquiredAt: null,
        Notes: null,
        IsPublic: false,
        OriginId: null,
        Attributes: null);

    [Fact]
    public async Task Handle_ValidCommand_CreatesGemAndReturnsDto()
    {
        // Arrange
        var userId = Guid.NewGuid();

        var contextMock = new Mock<IApplicationDbContext>();
        var currentUserMock = new Mock<ICurrentUserService>();
        var storageMock = new Mock<IStorageService>();

        currentUserMock.Setup(u => u.UserId).Returns(userId);
        storageMock.Setup(s => s.GetPublicUrl(It.IsAny<string>())).Returns("http://test/photo.jpg");

        var gems = new List<Gem>();
        var mockSet = gems.BuildMockDbSet();
        contextMock.Setup(c => c.Gems).Returns(mockSet.Object);
        contextMock
            .Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        var handler = new CreateGemCommandHandler(contextMock.Object, currentUserMock.Object, storageMock.Object);
        var command = MakeCommand("Sapphire");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal("Sapphire", result.Name);
        Assert.Equal(userId, result.OwnerId);
        mockSet.Verify(s => s.Add(It.Is<Gem>(g => g.Name == "Sapphire" && g.OwnerId == userId)), Times.Once);
        contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_NoCurrentUser_ThrowsForbiddenException()
    {
        // Arrange
        var contextMock = new Mock<IApplicationDbContext>();
        var currentUserMock = new Mock<ICurrentUserService>();
        var storageMock = new Mock<IStorageService>();

        currentUserMock.Setup(u => u.UserId).Returns((Guid?)null);

        var handler = new CreateGemCommandHandler(contextMock.Object, currentUserMock.Object, storageMock.Object);
        var command = MakeCommand();

        // Act & Assert
        await Assert.ThrowsAsync<ForbiddenException>(() =>
            handler.Handle(command, CancellationToken.None));
    }
}
