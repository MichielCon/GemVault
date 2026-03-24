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

    [HttpDelete("bulk")]
    public async Task<IActionResult> BulkDelete(
        [FromBody] BulkDeleteGemParcelsRequest body,
        CancellationToken ct)
    {
        await mediator.Send(new BulkDeleteGemParcelsCommand(body.Ids.Select(Guid.Parse).ToList()), ct);
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

    [HttpGet("export")]
    public async Task<IActionResult> Export(CancellationToken ct)
    {
        var items = await mediator.Send(new ExportGemParcelsQuery(), ct);
        var csv = BuildCsv(
            "Name,Species,Variety,Quantity,Total Weight (ct),Color,Treatment,Purchase Price,Acquired On,Origin,Locality,Notes,Added On",
            items.Select(p => new[]
            {
                p.Name, p.Species, p.Variety, p.Quantity.ToString(), p.TotalWeightCarats?.ToString() ?? "",
                p.Color, p.Treatment,
                p.PurchasePrice?.ToString("F2") ?? "", p.AcquiredAt ?? "",
                p.OriginCountry, p.Locality, p.Notes, p.AddedOn
            }));
        var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
        return File(bytes, "text/csv", "parcels-export.csv");
    }

    private static string BuildCsv(string header, IEnumerable<string?[]> rows)
    {
        var sb = new System.Text.StringBuilder();
        sb.AppendLine(header);
        foreach (var row in rows)
            sb.AppendLine(string.Join(",", row.Select(Escape)));
        return sb.ToString();
    }

    private static string Escape(string? value)
    {
        if (string.IsNullOrEmpty(value)) return "";
        if (value.Contains(',') || value.Contains('"') || value.Contains('\n') || value.Contains('\r'))
            return $"\"{value.Replace("\"", "\"\"")}\"";
        return value;
    }
}

public record BulkDeleteGemParcelsRequest(List<string> Ids);

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
