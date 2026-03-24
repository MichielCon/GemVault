using GemVault.Application.GemParcels.Commands;
using GemVault.Application.GemParcels.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1/gem-parcels")]
[Authorize]
public class GemParcelsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyGemParcels(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? originId = null,
        [FromQuery] string? status = null,
        [FromQuery] string? species = null,
        [FromQuery] string? color = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] string? sortBy = "date",
        [FromQuery] string? sortDir = "desc",
        CancellationToken ct = default)
    {
        var result = await mediator.Send(
            new GetMyGemParcelsQuery(page, pageSize, search, originId, status, species, color, minPrice, maxPrice, sortBy, sortDir),
            ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetGemParcelByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGemParcelCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateGemParcelCommandBody body,
        CancellationToken ct)
    {
        var command = new UpdateGemParcelCommand(
            id, body.Name, body.Species, body.Variety, body.Quantity,
            body.TotalWeightCarats, body.Color, body.Treatment,
            body.PurchasePrice, body.AcquiredAt, body.Notes, body.IsPublic, body.OriginId);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await mediator.Send(new SoftDeleteGemParcelCommand(id), ct);
        return NoContent();
    }

    [HttpDelete("photos/{photoId:guid}")]
    public async Task<IActionResult> DeletePhoto(Guid photoId, CancellationToken ct)
    {
        await mediator.Send(new DeleteGemParcelPhotoCommand(photoId), ct);
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
        var command = new UploadGemParcelPhotoCommand(
            id, stream, file.FileName, file.ContentType, file.Length, isCover);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }
}

// Separate body record to allow id injection from route
public record UpdateGemParcelCommandBody(
    string Name,
    string? Species,
    string? Variety,
    int Quantity,
    decimal? TotalWeightCarats,
    string? Color,
    string? Treatment,
    decimal? PurchasePrice,
    DateTime? AcquiredAt,
    string? Notes,
    bool IsPublic,
    Guid? OriginId);
