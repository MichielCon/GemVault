using GemVault.Application.Gems.Commands;
using GemVault.Application.Gems.Queries;
using GemVault.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1/gems")]
[Authorize]
public class GemsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyGems(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? originId = null,
        [FromQuery] string? status = null,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(new GetMyGemsQuery(page, pageSize, search, originId, status), ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetGemByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGemCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateGemCommandBody body,
        CancellationToken ct)
    {
        var command = new UpdateGemCommand(
            id, body.Name, body.Species, body.Variety, body.WeightCarats,
            body.Color, body.Clarity, body.Cut, body.Treatment, body.Shape,
            body.LengthMm, body.WidthMm, body.HeightMm, body.PurchasePrice,
            body.AcquiredAt, body.Notes, body.IsPublic, body.OriginId, body.Attributes,
            body.Status);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await mediator.Send(new SoftDeleteGemCommand(id), ct);
        return NoContent();
    }

    [HttpDelete("photos/{photoId:guid}")]
    public async Task<IActionResult> DeletePhoto(Guid photoId, CancellationToken ct)
    {
        await mediator.Send(new DeleteGemPhotoCommand(photoId), ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/photos")]
    [RequestSizeLimit(25 * 1024 * 1024)]
    public async Task<IActionResult> UploadPhoto(
        Guid id,
        IFormFile file,
        [FromQuery] bool isCover = false,
        CancellationToken ct = default)
    {
        if (file.Length == 0)
            return BadRequest(new { title = "File is empty." });

        using var stream = file.OpenReadStream();
        var command = new UploadGemPhotoCommand(
            id, stream, file.FileName, file.ContentType, file.Length, isCover);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }
}

// Separate body record to allow id injection from route
public record UpdateGemCommandBody(
    string Name,
    string? Species,
    string? Variety,
    decimal? WeightCarats,
    string? Color,
    string? Clarity,
    string? Cut,
    string? Treatment,
    string? Shape,
    decimal? LengthMm,
    decimal? WidthMm,
    decimal? HeightMm,
    decimal? PurchasePrice,
    DateTime? AcquiredAt,
    string? Notes,
    bool IsPublic,
    Guid? OriginId,
    string? Attributes,
    GemStatus Status = GemStatus.Available);
