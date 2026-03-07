using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Gems.Queries;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MockQueryable.Moq;
using Moq;

namespace GemVault.Tests.Unit.Application;

public class GetGemByIdQueryHandlerTests
{
    private static GetGemByIdQueryHandler BuildHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IStorageService storage) =>
        new(context, currentUser, storage);

    [Fact]
    public async Task Handle_ExistingGemOwnedByUser_ReturnsGemDto()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var gemId = Guid.NewGuid();

        var gem = new Gem
        {
            Id = gemId,
            Name = "Emerald",
            OwnerId = userId,
            IsDeleted = false
        };

        var gems = new List<Gem> { gem };
        var mockSet = gems.BuildMockDbSet();

        var contextMock = new Mock<IApplicationDbContext>();
        contextMock.Setup(c => c.Gems).Returns(mockSet.Object);

        var currentUserMock = new Mock<ICurrentUserService>();
        currentUserMock.Setup(u => u.UserId).Returns(userId);

        var storageMock = new Mock<IStorageService>();
        storageMock.Setup(s => s.GetPublicUrl(It.IsAny<string>())).Returns("http://test/photo.jpg");

        var handler = BuildHandler(contextMock.Object, currentUserMock.Object, storageMock.Object);
        var query = new GetGemByIdQuery(gemId);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Equal(gemId, result.Id);
        Assert.Equal("Emerald", result.Name);
        Assert.Equal(userId, result.OwnerId);
    }

    [Fact]
    public async Task Handle_GemNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var gems = new List<Gem>();
        var mockSet = gems.BuildMockDbSet();

        var contextMock = new Mock<IApplicationDbContext>();
        contextMock.Setup(c => c.Gems).Returns(mockSet.Object);

        var currentUserMock = new Mock<ICurrentUserService>();
        currentUserMock.Setup(u => u.UserId).Returns(Guid.NewGuid());

        var storageMock = new Mock<IStorageService>();

        var handler = BuildHandler(contextMock.Object, currentUserMock.Object, storageMock.Object);
        var query = new GetGemByIdQuery(Guid.NewGuid());

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(query, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_GemOwnedByDifferentUser_ThrowsForbiddenException()
    {
        // Arrange
        // The handler finds the gem but then checks ownership. When OwnerId != currentUser.UserId
        // it throws ForbiddenException (access is denied without revealing gem existence).
        var gemOwner = Guid.NewGuid();
        var currentUserId = Guid.NewGuid();
        var gemId = Guid.NewGuid();

        var gem = new Gem
        {
            Id = gemId,
            Name = "Diamond",
            OwnerId = gemOwner,
            IsDeleted = false
        };

        var gems = new List<Gem> { gem };
        var mockSet = gems.BuildMockDbSet();

        var contextMock = new Mock<IApplicationDbContext>();
        contextMock.Setup(c => c.Gems).Returns(mockSet.Object);

        var currentUserMock = new Mock<ICurrentUserService>();
        currentUserMock.Setup(u => u.UserId).Returns(currentUserId);

        var storageMock = new Mock<IStorageService>();

        var handler = BuildHandler(contextMock.Object, currentUserMock.Object, storageMock.Object);
        var query = new GetGemByIdQuery(gemId);

        // Act & Assert
        await Assert.ThrowsAsync<ForbiddenException>(() =>
            handler.Handle(query, CancellationToken.None));
    }
}
