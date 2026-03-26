using GemVault.Application.Gems.Commands;
using GemVault.Application.Gems.Queries;
using GemVault.Domain.Enums;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using PdfUnit = QuestPDF.Infrastructure.Unit;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1/gems")]
[Authorize]
[EnableRateLimiting("api")]
public class GemsController(IMediator mediator, IStorageService storage) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyGems(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? originId = null,
        [FromQuery] string? status = null,
        [FromQuery] string? gemStatusFilter = null,
        [FromQuery] string? species = null,
        [FromQuery] string? color = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] string? sortBy = "date",
        [FromQuery] string? sortDir = "desc",
        CancellationToken ct = default)
    {
        var parsedGemStatus = Enum.TryParse<GemStatus>(gemStatusFilter, out var gs) ? gs : (GemStatus?)null;
        var result = await mediator.Send(
            new GetMyGemsQuery(page, pageSize, search, originId, status, parsedGemStatus, species, color, minPrice, maxPrice, sortBy, sortDir),
            ct);
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
            body.Status, body.RoughWeightCarats, body.CutPlanNotes,
            body.CuttingDesign, body.PlannedFacets,
            body.ConsigneeName, body.ConsigneeContact, body.ConsignmentTargetPrice,
            body.ConsignmentDate, body.ConsignmentReturnDate);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await mediator.Send(new SoftDeleteGemCommand(id), ct);
        return NoContent();
    }

    [HttpDelete("bulk")]
    public async Task<IActionResult> BulkDelete(
        [FromBody] BulkDeleteGemsRequest body,
        CancellationToken ct)
    {
        await mediator.Send(new BulkDeleteGemsCommand(body.Ids), ct);
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

    [HttpGet("{id:guid}/report.pdf")]
    public async Task<IActionResult> GetGemReport(Guid id, CancellationToken ct)
    {
        var gem = await mediator.Send(new GetGemByIdQuery(id), ct);

        byte[]? coverImageBytes = null;
        var cover = gem.Photos.FirstOrDefault(p => p.IsCover) ?? gem.Photos.FirstOrDefault();
        if (cover is not null)
        {
            // Extract object key from URL: http://host/bucket/{key...}
            var uri = new Uri(cover.Url);
            var segments = uri.AbsolutePath.TrimStart('/').Split('/', 2);
            if (segments.Length == 2)
                coverImageBytes = await storage.DownloadAsync(segments[1], ct);
        }

        var pdfBytes = GenerateGemReportPdf(gem, coverImageBytes);
        var safeName = string.Concat(gem.Name.Where(c => char.IsLetterOrDigit(c) || c == '-' || c == ' ')).Trim().Replace(' ', '-');
        return File(pdfBytes, "application/pdf", $"{safeName}-report.pdf");
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export(
        [FromQuery] string format = "csv",
        CancellationToken ct = default)
    {
        var items = await mediator.Send(new ExportGemsQuery(), ct);

        if (format.Equals("pdf", StringComparison.OrdinalIgnoreCase))
        {
            var pdfBytes = GenerateGemsPdf(items);
            return File(pdfBytes, "application/pdf", "gems.pdf");
        }

        // Default: CSV
        var csv = BuildCsv(
            "Name,Species,Variety,Weight (ct),Color,Clarity,Cut,Shape,Treatment,Purchase Price,Acquired On,Status,Origin,Locality,Notes,Added On",
            items.Select(g => new[]
            {
                g.Name, g.Species, g.Variety, g.WeightCarats?.ToString() ?? "",
                g.Color, g.Clarity, g.Cut, g.Shape, g.Treatment,
                g.PurchasePrice?.ToString("F2") ?? "", g.AcquiredAt ?? "",
                g.Status, g.OriginCountry, g.Locality, g.Notes, g.AddedOn
            }));
        var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
        return File(bytes, "text/csv", "gems-export.csv");
    }

    private static byte[] GenerateGemReportPdf(GemVault.Application.Gems.DTOs.GemDto gem, byte[]? coverImageBytes)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var textMuted  = Color.FromHex("#9E9E9E");
        var textHeader = Color.FromHex("#212121");
        var sectionBg  = Color.FromHex("#F5F5F5");
        var borderLine = Color.FromHex("#E0E0E0");
        var accentBg   = Color.FromHex("#EDE9FE"); // violet-100
        var accentText = Color.FromHex("#5B21B6"); // violet-800

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2f, PdfUnit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(10));

                // ── Header ──
                page.Header()
                    .PaddingBottom(12)
                    .Row(row =>
                    {
                        row.RelativeItem()
                            .Text("GemVault — Gem Record")
                            .SemiBold()
                            .FontSize(13)
                            .FontColor(textHeader);

                        row.ConstantItem(180)
                            .AlignRight()
                            .Text($"Generated {DateTime.UtcNow:yyyy-MM-dd}")
                            .FontSize(9)
                            .FontColor(textMuted);
                    });

                // ── Content ──
                page.Content().Column(col =>
                {
                    col.Spacing(14);

                    // Hero row: photo + title
                    col.Item().Row(row =>
                    {
                        if (coverImageBytes is not null && coverImageBytes.Length > 0)
                        {
                            row.ConstantItem(130).PaddingRight(16)
                                .Background(Colors.White)
                                .Image(coverImageBytes).FitWidth();
                        }

                        row.RelativeItem().Column(inner =>
                        {
                            inner.Item().Text(gem.Name).SemiBold().FontSize(20).FontColor(textHeader);

                            if (gem.Species != null || gem.Variety != null)
                            {
                                var subtitle = string.Join(" — ", new[] { gem.Species, gem.Variety }.Where(s => s != null));
                                inner.Item().Text(subtitle).FontSize(11).FontColor(textMuted);
                            }

                            inner.Item().PaddingTop(6).Row(statusRow =>
                            {
                                statusRow.AutoItem()
                                    .Background(accentBg)
                                    .Padding(4)
                                    .Text(gem.Status.ToString())
                                    .FontSize(9)
                                    .SemiBold()
                                    .FontColor(accentText);

                                if (gem.WeightCarats.HasValue)
                                {
                                    statusRow.AutoItem()
                                        .PaddingLeft(8)
                                        .Text($"{gem.WeightCarats.Value:0.00} ct")
                                        .FontSize(10)
                                        .SemiBold()
                                        .FontColor(textHeader);
                                }
                            });
                        });
                    });

                    // ── Properties ──
                    void Section(string title, Action<ColumnDescriptor> body)
                    {
                        col.Item().Column(s =>
                        {
                            s.Item()
                                .Background(sectionBg)
                                .BorderBottom(1, PdfUnit.Point)
                                .BorderColor(borderLine)
                                .Padding(5)
                                .Text(title)
                                .SemiBold()
                                .FontSize(9)
                                .FontColor(textMuted);
                            s.Item().Padding(4).Column(body);
                        });
                    }

                    void PropRow(ColumnDescriptor c, string label, string? value)
                    {
                        if (string.IsNullOrEmpty(value)) return;
                        c.Item().Row(r =>
                        {
                            r.ConstantItem(130).Text(label).FontSize(9).FontColor(textMuted);
                            r.RelativeItem().Text(value).FontSize(10).FontColor(textHeader);
                        });
                        c.Item().PaddingBottom(3);
                    }

                    Section("PROPERTIES", c =>
                    {
                        PropRow(c, "Weight", gem.WeightCarats.HasValue ? $"{gem.WeightCarats.Value:0.00} ct" : null);
                        PropRow(c, "Color", gem.Color);
                        PropRow(c, "Clarity", gem.Clarity);
                        PropRow(c, "Cut", gem.Cut);
                        PropRow(c, "Shape", gem.Shape);
                        PropRow(c, "Treatment", gem.Treatment);
                        if (gem.LengthMm.HasValue && gem.WidthMm.HasValue)
                        {
                            var dim = $"{gem.LengthMm.Value:0.#} × {gem.WidthMm.Value:0.#}";
                            if (gem.HeightMm.HasValue) dim += $" × {gem.HeightMm.Value:0.#}";
                            PropRow(c, "Dimensions", dim + " mm");
                        }
                        PropRow(c, "Origin", gem.OriginCountry != null
                            ? string.Join(", ", new[] { gem.OriginLocality, gem.OriginCountry }.Where(s => s != null))
                            : null);
                    });

                    Section("ACQUISITION", c =>
                    {
                        PropRow(c, "Purchase price", gem.PurchasePrice.HasValue ? $"${gem.PurchasePrice.Value:0.00}" : null);
                        PropRow(c, "Acquired on", gem.AcquiredAt.HasValue ? gem.AcquiredAt.Value.ToString("yyyy-MM-dd") : null);
                        PropRow(c, "Added to vault", gem.CreatedAt.ToString("yyyy-MM-dd"));
                        PropRow(c, "Source parcel", gem.SourceParcelName);
                    });

                    if (gem.Certificates.Count > 0)
                    {
                        Section("LABORATORY CERTIFICATES", c =>
                        {
                            foreach (var cert in gem.Certificates)
                            {
                                var parts = new List<string>();
                                if (!string.IsNullOrEmpty(cert.Lab)) parts.Add(cert.Lab);
                                if (!string.IsNullOrEmpty(cert.CertNumber)) parts.Add($"#{cert.CertNumber}");
                                if (!string.IsNullOrEmpty(cert.Grade)) parts.Add(cert.Grade);
                                if (cert.IssueDate.HasValue) parts.Add(cert.IssueDate.Value.ToString("yyyy-MM-dd"));
                                c.Item().Text(string.Join("  ·  ", parts)).FontSize(10).FontColor(textHeader);
                                c.Item().PaddingBottom(3);
                            }
                        });
                    }

                    if (gem.RoughWeightCarats.HasValue)
                    {
                        Section("CUT PLAN", c =>
                        {
                            PropRow(c, "Rough weight", $"{gem.RoughWeightCarats.Value:0.00} ct");
                            PropRow(c, "Design", gem.CuttingDesign);
                            if (gem.WeightCarats.HasValue && gem.RoughWeightCarats.Value > 0)
                                PropRow(c, "Yield", $"{gem.WeightCarats.Value / gem.RoughWeightCarats.Value * 100:0.0}%");
                            PropRow(c, "Plan notes", gem.CutPlanNotes);
                        });
                    }

                    if (!string.IsNullOrWhiteSpace(gem.Notes))
                    {
                        Section("NOTES", c =>
                        {
                            c.Item().Text(gem.Notes!).FontSize(10).FontColor(textHeader).Italic();
                        });
                    }
                });

                // ── Footer ──
                page.Footer()
                    .Row(row =>
                    {
                        row.RelativeItem()
                            .Text("This record is maintained on GemVault")
                            .FontSize(8)
                            .FontColor(textMuted);

                        row.ConstantItem(100)
                            .AlignRight()
                            .Text(text =>
                            {
                                text.Span("Page ").FontSize(8).FontColor(textMuted);
                                text.CurrentPageNumber().FontSize(8).FontColor(textMuted);
                                text.Span(" of ").FontSize(8).FontColor(textMuted);
                                text.TotalPages().FontSize(8).FontColor(textMuted);
                            });
                    });
            });
        }).GeneratePdf();
    }

    private static byte[] GenerateGemsPdf(List<GemExportDto> gems)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        // Colour palette (Material Design greys expressed as hex)
        var headerBg   = Color.FromHex("#616161"); // Grey 700
        var rowAlt     = Color.FromHex("#F5F5F5"); // Grey 100
        var rowEven    = Color.FromHex("#FFFFFF");
        var borderLine = Color.FromHex("#E0E0E0"); // Grey 300
        var textMuted  = Color.FromHex("#9E9E9E"); // Grey 500
        var textHeader = Color.FromHex("#212121"); // Grey 900

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(1.5f, PdfUnit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(9));

                page.Header()
                    .PaddingBottom(8)
                    .Text("GemVault — Gem Inventory")
                    .SemiBold()
                    .FontSize(14)
                    .FontColor(textHeader);

                page.Content().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(3f);   // Name
                        columns.RelativeColumn(2f);   // Species
                        columns.RelativeColumn(2f);   // Variety
                        columns.RelativeColumn(1.5f); // Color
                        columns.RelativeColumn(1.5f); // Weight (ct)
                        columns.RelativeColumn(2f);   // Origin
                        columns.RelativeColumn(1.5f); // Purchase Price
                        columns.RelativeColumn(1.5f); // Status
                    });

                    table.Header(header =>
                    {
                        void HeaderCell(string label)
                        {
                            header.Cell()
                                .Background(headerBg)
                                .Padding(4)
                                .Text(label)
                                .SemiBold()
                                .FontColor(Color.FromHex("#FFFFFF"));
                        }

                        HeaderCell("Name");
                        HeaderCell("Species");
                        HeaderCell("Variety");
                        HeaderCell("Color");
                        HeaderCell("Weight (ct)");
                        HeaderCell("Origin");
                        HeaderCell("Purchase Price");
                        HeaderCell("Status");
                    });

                    bool alternate = false;
                    foreach (var gem in gems)
                    {
                        var rowBg = alternate ? rowAlt : rowEven;
                        alternate = !alternate;

                        void DataCell(string text)
                        {
                            table.Cell()
                                .Background(rowBg)
                                .BorderBottom(1, PdfUnit.Point)
                                .BorderColor(borderLine)
                                .Padding(4)
                                .Text(text)
                                .FontColor(textHeader);
                        }

                        DataCell(gem.Name);
                        DataCell(gem.Species ?? "—");
                        DataCell(gem.Variety ?? "—");
                        DataCell(gem.Color ?? "—");
                        DataCell(gem.WeightCarats.HasValue ? gem.WeightCarats.Value.ToString("0.00") : "—");
                        DataCell(gem.OriginCountry ?? "—");
                        DataCell(gem.PurchasePrice.HasValue ? $"${gem.PurchasePrice.Value:0.00}" : "—");
                        DataCell(gem.Status ?? "—");
                    }
                });

                page.Footer()
                    .AlignRight()
                    .Text(text =>
                    {
                        text.Span($"Generated {DateTime.UtcNow:yyyy-MM-dd}  •  Page ")
                            .FontColor(textMuted);
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

public record BulkDeleteGemsRequest(List<Guid> Ids);

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
    GemStatus Status = GemStatus.Available,
    decimal? RoughWeightCarats = null,
    string? CutPlanNotes = null,
    string? CuttingDesign = null,
    int? PlannedFacets = null,
    string? ConsigneeName = null,
    string? ConsigneeContact = null,
    decimal? ConsignmentTargetPrice = null,
    DateOnly? ConsignmentDate = null,
    DateOnly? ConsignmentReturnDate = null);
