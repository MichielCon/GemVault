using GemVault.Application.GemParcels.Commands;
using GemVault.Application.GemParcels.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using PdfUnit = QuestPDF.Infrastructure.Unit;

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
    public async Task<IActionResult> Export(
        [FromQuery] string format = "csv",
        CancellationToken ct = default)
    {
        var items = await mediator.Send(new ExportGemParcelsQuery(), ct);

        if (format.Equals("pdf", StringComparison.OrdinalIgnoreCase))
        {
            var pdfBytes = GenerateParcelsPdf(items);
            return File(pdfBytes, "application/pdf", "parcels.pdf");
        }

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

    private static byte[] GenerateParcelsPdf(List<GemParcelExportDto> parcels)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var headerBg  = Color.FromHex("#616161");
        var rowAlt    = Color.FromHex("#F5F5F5");
        var border    = Color.FromHex("#E0E0E0");
        var textMuted = Color.FromHex("#9E9E9E");

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(1.5f, PdfUnit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(9));

                page.Header()
                    .PaddingBottom(8)
                    .Text("GemVault — Parcel Inventory")
                    .SemiBold().FontSize(14).FontColor(Colors.Grey.Darken2);

                page.Content().Table(table =>
                {
                    table.ColumnsDefinition(cols =>
                    {
                        cols.RelativeColumn(3);   // Name
                        cols.RelativeColumn(2);   // Species
                        cols.RelativeColumn(2);   // Variety
                        cols.RelativeColumn(1);   // Qty
                        cols.RelativeColumn(1.5f); // Weight
                        cols.RelativeColumn(1.5f); // Color
                        cols.RelativeColumn(2);   // Origin
                        cols.RelativeColumn(1.5f); // Price
                    });

                    table.Header(header =>
                    {
                        static IContainer H(IContainer c, string bg) =>
                            c.Background(bg).Padding(4);

                        var hStyle = TextStyle.Default.SemiBold().FontColor(Colors.White);
                        header.Cell().Element(c => H(c, headerBg)).Text("Name").Style(hStyle);
                        header.Cell().Element(c => H(c, headerBg)).Text("Species").Style(hStyle);
                        header.Cell().Element(c => H(c, headerBg)).Text("Variety").Style(hStyle);
                        header.Cell().Element(c => H(c, headerBg)).Text("Qty").Style(hStyle);
                        header.Cell().Element(c => H(c, headerBg)).Text("Weight (ct)").Style(hStyle);
                        header.Cell().Element(c => H(c, headerBg)).Text("Color").Style(hStyle);
                        header.Cell().Element(c => H(c, headerBg)).Text("Origin").Style(hStyle);
                        header.Cell().Element(c => H(c, headerBg)).Text("Purchase Price").Style(hStyle);
                    });

                    bool alt = false;
                    foreach (var p in parcels)
                    {
                        var bg = alt ? rowAlt : Colors.White;
                        alt = !alt;

                        IContainer D(IContainer c) =>
                            c.Background(bg).BorderBottom(1).BorderColor(border).Padding(4);

                        table.Cell().Element(D).Text(p.Name);
                        table.Cell().Element(D).Text(p.Species ?? "—");
                        table.Cell().Element(D).Text(p.Variety ?? "—");
                        table.Cell().Element(D).Text(p.Quantity.ToString());
                        table.Cell().Element(D).Text(p.TotalWeightCarats.HasValue ? p.TotalWeightCarats.Value.ToString("0.00") : "—");
                        table.Cell().Element(D).Text(p.Color ?? "—");
                        table.Cell().Element(D).Text(p.OriginCountry ?? "—");
                        table.Cell().Element(D).Text(p.PurchasePrice.HasValue ? $"${p.PurchasePrice.Value:0.00}" : "—");
                    }
                });

                page.Footer().AlignRight().Text(text =>
                {
                    text.Span("Generated ").FontColor(textMuted);
                    text.Span(DateTime.UtcNow.ToString("yyyy-MM-dd")).FontColor(textMuted);
                    text.Span("  •  Page ").FontColor(textMuted);
                    text.CurrentPageNumber().FontColor(textMuted);
                    text.Span(" of ").FontColor(textMuted);
                    text.TotalPages().FontColor(textMuted);
                });
            });
        }).GeneratePdf();
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
