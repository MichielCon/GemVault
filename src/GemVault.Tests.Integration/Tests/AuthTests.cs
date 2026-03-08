using GemVault.Application.Auth.DTOs;
using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class AuthTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    [Fact]
    public async Task Register_ValidCredentials_Returns200WithAccessToken()
    {
        var res = await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email = "newuser@test.com", password = "Password1!", role = "Collector" });

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var body = await res.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions);
        Assert.NotNull(body);
        Assert.NotEmpty(body.AccessToken);
        Assert.NotEmpty(body.RefreshToken);
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns400()
    {
        var email = $"dup-{Guid.NewGuid():N}@test.com";
        await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email, password = "Password1!", role = "Collector" });

        var res = await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email, password = "Password1!", role = "Collector" });

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task Register_WeakPassword_Returns400()
    {
        var res = await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email = "weak@test.com", password = "abc", role = "Collector" });

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task Login_ValidCredentials_Returns200WithTokens()
    {
        var email = $"login-{Guid.NewGuid():N}@test.com";
        await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email, password = "Password1!", role = "Collector" });

        var res = await Client.PostAsJsonAsync("/api/v1/auth/login",
            new { email, password = "Password1!" });

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var body = await res.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions);
        Assert.NotNull(body);
        Assert.NotEmpty(body.AccessToken);
    }

    [Fact]
    public async Task Login_WrongPassword_Returns400()
    {
        var email = $"wrongpw-{Guid.NewGuid():N}@test.com";
        await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email, password = "Password1!", role = "Collector" });

        var res = await Client.PostAsJsonAsync("/api/v1/auth/login",
            new { email, password = "WrongPass1!" });

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task ProtectedEndpoint_WithoutToken_Returns401()
    {
        var res = await Client.GetAsync("/api/v1/gems");

        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }
}
