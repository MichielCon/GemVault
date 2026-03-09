using GemVault.Application.Auth.DTOs;
using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Headers;
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

    [Fact]
    public async Task Refresh_ValidToken_Returns200WithNewTokens()
    {
        var email = $"refresh-{Guid.NewGuid():N}@test.com";
        var registerRes = await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email, password = "Password1!", role = "Collector" });
        var auth = await registerRes.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions);

        var refreshRes = await Client.PostAsJsonAsync("/api/v1/auth/refresh",
            new { refreshToken = auth!.RefreshToken });

        Assert.Equal(HttpStatusCode.OK, refreshRes.StatusCode);
        var newAuth = await refreshRes.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions);
        Assert.NotNull(newAuth);
        Assert.NotEmpty(newAuth.AccessToken);
        Assert.NotEmpty(newAuth.RefreshToken);
    }

    [Fact]
    public async Task Refresh_UsedToken_Returns400()
    {
        var email = $"refresh-used-{Guid.NewGuid():N}@test.com";
        var registerRes = await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email, password = "Password1!", role = "Collector" });
        var auth = await registerRes.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions);
        var originalRefreshToken = auth!.RefreshToken;

        // First refresh — rotates the token
        await Client.PostAsJsonAsync("/api/v1/auth/refresh",
            new { refreshToken = originalRefreshToken });

        // Second refresh using the already-rotated (old) token → 400
        var staleRes = await Client.PostAsJsonAsync("/api/v1/auth/refresh",
            new { refreshToken = originalRefreshToken });

        Assert.Equal(HttpStatusCode.BadRequest, staleRes.StatusCode);
    }

    [Fact]
    public async Task Logout_Returns204()
    {
        var email = $"logout-{Guid.NewGuid():N}@test.com";
        var registerRes = await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email, password = "Password1!", role = "Collector" });
        var auth = await registerRes.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions);

        Client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", auth!.AccessToken);

        var logoutRes = await Client.PostAsJsonAsync("/api/v1/auth/logout",
            new { refreshToken = auth.RefreshToken });

        Assert.Equal(HttpStatusCode.NoContent, logoutRes.StatusCode);
    }

    [Fact]
    public async Task Logout_ThenRefresh_Returns400()
    {
        var email = $"logout-refresh-{Guid.NewGuid():N}@test.com";
        var registerRes = await Client.PostAsJsonAsync("/api/v1/auth/register",
            new { email, password = "Password1!", role = "Collector" });
        var auth = await registerRes.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions);

        Client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", auth!.AccessToken);

        await Client.PostAsJsonAsync("/api/v1/auth/logout",
            new { refreshToken = auth.RefreshToken });

        // Clear auth header before attempting refresh
        Client.DefaultRequestHeaders.Authorization = null;

        var refreshRes = await Client.PostAsJsonAsync("/api/v1/auth/refresh",
            new { refreshToken = auth.RefreshToken });

        Assert.Equal(HttpStatusCode.BadRequest, refreshRes.StatusCode);
    }
}
