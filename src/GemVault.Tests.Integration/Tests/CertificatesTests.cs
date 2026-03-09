using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class CertificatesTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    private record CertDto(Guid Id, string CertNumber, string? Lab, string? Grade);
    private record GemWithCerts(Guid Id, string Name, List<CertDto> Certificates);

    private static MultipartFormDataContent BuildCertContent(
        string certNumber = "GRS2026-001",
        string? lab = "GRS",
        string contentType = "application/pdf")
    {
        var content = new MultipartFormDataContent();
        content.Add(new StringContent(certNumber), "certNumber");
        if (lab is not null)
            content.Add(new StringContent(lab), "lab");

        var pdfBytes = new byte[] { 0x25, 0x50, 0x44, 0x46 }; // %PDF header
        var fileContent = new ByteArrayContent(pdfBytes);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        content.Add(fileContent, "file", "cert.pdf");

        return content;
    }

    private async Task<Guid> CreateGemAsync()
    {
        var res = await Client.PostAsJsonAsync("/api/v1/gems", new { name = "Test Gem" });
        res.EnsureSuccessStatusCode();
        var gem = await res.Content.ReadFromJsonAsync<GemWithCerts>(JsonOptions);
        return gem!.Id;
    }

    [Fact]
    public async Task UploadCertificate_ValidPdf_Returns200()
    {
        await AuthenticateAsync();
        var gemId = await CreateGemAsync();

        using var content = BuildCertContent();
        var res = await Client.PostAsync($"/api/v1/gems/{gemId}/certificates", content);

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var cert = await res.Content.ReadFromJsonAsync<CertDto>(JsonOptions);
        Assert.NotNull(cert);
        Assert.Equal("GRS2026-001", cert.CertNumber);
        Assert.Equal("GRS", cert.Lab);
        Assert.NotEqual(Guid.Empty, cert.Id);
    }

    [Fact]
    public async Task UploadCertificate_MissingCertNumber_Returns400()
    {
        await AuthenticateAsync();
        var gemId = await CreateGemAsync();

        // Send an empty certNumber — the handler requires a non-empty value
        using var content = BuildCertContent(certNumber: "");
        var res = await Client.PostAsync($"/api/v1/gems/{gemId}/certificates", content);

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task UploadCertificate_NonPdfFile_Returns400()
    {
        await AuthenticateAsync();
        var gemId = await CreateGemAsync();

        // image/jpeg content type — handler only accepts application/pdf
        using var content = BuildCertContent(contentType: "image/jpeg");
        var res = await Client.PostAsync($"/api/v1/gems/{gemId}/certificates", content);

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task UploadCertificate_OtherUsersGem_Returns403()
    {
        // User A creates a gem
        var tokenA = await RegisterAndLoginAsync();
        Authenticate(tokenA);
        var gemId = await CreateGemAsync();

        // User B tries to upload a certificate for User A's gem
        var tokenB = await RegisterAndLoginAsync();
        Authenticate(tokenB);

        using var content = BuildCertContent();
        var res = await Client.PostAsync($"/api/v1/gems/{gemId}/certificates", content);

        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
    }

    [Fact]
    public async Task DeleteCertificate_Returns204()
    {
        await AuthenticateAsync();
        var gemId = await CreateGemAsync();

        using var uploadContent = BuildCertContent();
        var uploadRes = await Client.PostAsync($"/api/v1/gems/{gemId}/certificates", uploadContent);
        Assert.Equal(HttpStatusCode.OK, uploadRes.StatusCode);
        var cert = await uploadRes.Content.ReadFromJsonAsync<CertDto>(JsonOptions);
        Assert.NotNull(cert);

        var deleteRes = await Client.DeleteAsync($"/api/v1/certificates/{cert.Id}");

        Assert.Equal(HttpStatusCode.NoContent, deleteRes.StatusCode);
    }

    [Fact]
    public async Task GetGem_AfterCertUpload_ContainsCertificate()
    {
        await AuthenticateAsync();
        var gemId = await CreateGemAsync();

        using var content = BuildCertContent(certNumber: "AGL-2026-999", lab: "AGL");
        var uploadRes = await Client.PostAsync($"/api/v1/gems/{gemId}/certificates", content);
        Assert.Equal(HttpStatusCode.OK, uploadRes.StatusCode);

        var getRes = await Client.GetAsync($"/api/v1/gems/{gemId}");
        Assert.Equal(HttpStatusCode.OK, getRes.StatusCode);
        var gem = await getRes.Content.ReadFromJsonAsync<GemWithCerts>(JsonOptions);
        Assert.NotNull(gem);
        Assert.Single(gem.Certificates);
        Assert.Equal("AGL-2026-999", gem.Certificates[0].CertNumber);
        Assert.Equal("AGL", gem.Certificates[0].Lab);
    }
}
