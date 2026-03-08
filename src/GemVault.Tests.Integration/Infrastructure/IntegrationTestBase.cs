using GemVault.Application.Auth.DTOs;
using GemVault.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GemVault.Tests.Integration.Infrastructure;

[Collection(nameof(IntegrationTestCollection))]
public abstract class IntegrationTestBase : IAsyncLifetime
{
    protected readonly DatabaseFixture Fixture;
    protected HttpClient Client;

    // API serializes enums as strings — must use the same options when deserializing
    protected static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() },
    };

    protected IntegrationTestBase(DatabaseFixture fixture)
    {
        Fixture = fixture;
        Client = fixture.Factory.CreateClient();
    }

    public async Task InitializeAsync() => await Fixture.ResetDatabaseAsync();
    public Task DisposeAsync() => Task.CompletedTask;

    protected async Task<string> RegisterAndLoginAsync(string? email = null)
    {
        email ??= $"test-{Guid.NewGuid():N}@test.com";
        var res = await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email, password = "Password1!", role = "Collector" });
        res.EnsureSuccessStatusCode();
        var body = await res.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions)
            ?? throw new InvalidOperationException("null auth response");
        return body.AccessToken;
    }

    protected void Authenticate(string token) =>
        Client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

    protected async Task AuthenticateAsync() =>
        Authenticate(await RegisterAndLoginAsync());

    /// <summary>Direct DB access for assertions (e.g. verify DateTime.Kind).</summary>
    protected ApplicationDbContext CreateDbContext()
    {
        var scope = Fixture.Factory.Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    }
}
