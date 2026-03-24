using Npgsql;
using Respawn;
using Testcontainers.PostgreSql;

namespace GemVault.Tests.Integration.Infrastructure;

public class DatabaseFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder()
        .WithImage("postgres:16-alpine")
        .WithDatabase("gemvault_test")
        .WithUsername("test")
        .WithPassword("test")
        .Build();

    private Respawner _respawner = null!;
    private NpgsqlConnection _connection = null!;

    public GemVaultWebApplicationFactory Factory { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        await _postgres.StartAsync();

        Factory = new GemVaultWebApplicationFactory(_postgres.GetConnectionString());
        // Trigger app startup — runs MigrateAsync() in Program.cs
        _ = Factory.CreateClient();

        _connection = new NpgsqlConnection(_postgres.GetConnectionString());
        await _connection.OpenAsync();

        _respawner = await Respawner.CreateAsync(_connection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.Postgres,
            SchemasToInclude = ["public"],
            TablesToIgnore =
            [
                new Respawn.Graph.Table("__EFMigrationsHistory"),
                new Respawn.Graph.Table("GemVocabularies"),
                new Respawn.Graph.Table("Origins"),
            ],
        });
    }

    public async Task ResetDatabaseAsync() => await _respawner.ResetAsync(_connection);

    public async Task DisposeAsync()
    {
        await _connection.DisposeAsync();
        await Factory.DisposeAsync();
        await _postgres.DisposeAsync();
    }
}
