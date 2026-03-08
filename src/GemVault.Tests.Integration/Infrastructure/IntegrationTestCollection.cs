namespace GemVault.Tests.Integration.Infrastructure;

[CollectionDefinition(nameof(IntegrationTestCollection))]
public class IntegrationTestCollection : ICollectionFixture<DatabaseFixture> { }
