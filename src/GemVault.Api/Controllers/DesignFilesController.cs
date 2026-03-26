using GemVault.Application.DesignFiles;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1")]
[Authorize]
[EnableRateLimiting("api")]
public class DesignFilesController(IMediator mediator) : ControllerBase
{
    /// <summary>Upload a design file (image/PDF/GemCutStudio/GemCAD) for a gem.</summary>
    [HttpPost("gems/{gemId:guid}/design-files")]
    [RequestSizeLimit(55 * 1024 * 1024)]
    public async Task<IActionResult> Upload(Guid gemId, IFormFile file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { title = "File is empty." });

        using var stream = file.OpenReadStream();
        var command = new UploadDesignFileCommand(
            gemId,
            stream,
            file.FileName,
            file.ContentType,
            file.Length);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    /// <summary>Delete a design file.</summary>
    [HttpDelete("design-files/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await mediator.Send(new DeleteDesignFileCommand(id), ct);
        return NoContent();
    }
}
