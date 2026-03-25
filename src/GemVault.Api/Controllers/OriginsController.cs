using GemVault.Application.Origins.Commands;
using GemVault.Application.Origins.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1/origins")]
[EnableRateLimiting("api")]
[Authorize]
public class OriginsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] string? search, CancellationToken ct)
    {
        var result = await mediator.Send(new GetOriginsQuery(search), ct);
        return Ok(result);
    }

    [HttpGet("map-data")]
    public async Task<IActionResult> GetMapData(CancellationToken ct)
    {
        var result = await mediator.Send(new GetOriginsMapDataQuery(), ct);
        return Ok(result);
    }

    [HttpGet("by-country")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByCountry([FromQuery] string country, CancellationToken ct)
    {
        var result = await mediator.Send(new GetOriginsByCountryQuery(country), ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetOriginByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOriginCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPost("find-or-create")]
    [Authorize]
    public async Task<IActionResult> FindOrCreate([FromBody] FindOrCreateOriginBody body, CancellationToken ct)
    {
        var result = await mediator.Send(new FindOrCreateOriginCommand(body.Country, body.Locality), ct);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOriginBody body, CancellationToken ct)
    {
        var command = new UpdateOriginCommand(id, body.Country, body.Locality);
        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await mediator.Send(new DeleteOriginCommand(id), ct);
        return NoContent();
    }
}

public record UpdateOriginBody(string Country, string? Locality);
public record FindOrCreateOriginBody(string Country, string? Locality);
