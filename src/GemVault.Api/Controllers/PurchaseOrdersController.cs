using GemVault.Application.PurchaseOrders.Commands;
using GemVault.Application.PurchaseOrders.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1/purchase-orders")]
[Authorize]
[EnableRateLimiting("api")]
public class PurchaseOrdersController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPurchaseOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? supplierId = null,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(new GetPurchaseOrdersQuery(page, pageSize, search, supplierId), ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetPurchaseOrderByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePurchaseOrderCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdatePurchaseOrderCommandBody body,
        CancellationToken ct)
    {
        var command = new UpdatePurchaseOrderCommand(id, body.SupplierId, body.BoughtFrom, body.Reference, body.OrderDate, body.Notes);
        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await mediator.Send(new DeletePurchaseOrderCommand(id), ct);
        return NoContent();
    }
}

public record UpdatePurchaseOrderCommandBody(Guid? SupplierId, string? BoughtFrom, string? Reference, DateTime OrderDate, string? Notes);
