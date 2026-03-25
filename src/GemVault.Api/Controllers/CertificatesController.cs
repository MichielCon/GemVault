using GemVault.Application.Certificates;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1")]
[Authorize]
[EnableRateLimiting("api")]
public class CertificatesController(IMediator mediator) : ControllerBase
{
    /// <summary>Upload a certificate PDF for a gem.</summary>
    [HttpPost("gems/{gemId:guid}/certificates")]
    [RequestSizeLimit(25 * 1024 * 1024)]
    public async Task<IActionResult> Upload(
        Guid gemId,
        IFormFile file,
        [FromForm] string certNumber,
        [FromForm] string? lab,
        [FromForm] string? grade,
        [FromForm] DateTime? issueDate,
        CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { title = "File is empty." });

        using var stream = file.OpenReadStream();
        var command = new UploadCertificateCommand(
            gemId,
            certNumber,
            lab,
            grade,
            issueDate,
            stream,
            file.FileName,
            file.ContentType,
            file.Length);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    /// <summary>Delete (soft-delete) a certificate.</summary>
    [HttpDelete("certificates/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await mediator.Send(new DeleteCertificateCommand(id), ct);
        return NoContent();
    }
}
