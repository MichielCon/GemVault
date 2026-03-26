using GemVault.Application.CuttingSessions;
using GemVault.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1")]
[Authorize]
[EnableRateLimiting("api")]
public class CuttingSessionsController(IMediator mediator) : ControllerBase
{
    /// <summary>List all cutting sessions for a gem.</summary>
    [HttpGet("gems/{gemId:guid}/cutting-sessions")]
    public async Task<IActionResult> GetSessions(Guid gemId, CancellationToken ct)
    {
        var result = await mediator.Send(new GetCuttingSessionsQuery(gemId), ct);
        return Ok(result);
    }

    /// <summary>Add a cutting session to a gem.</summary>
    [HttpPost("gems/{gemId:guid}/cutting-sessions")]
    public async Task<IActionResult> AddSession(
        Guid gemId,
        [FromBody] AddCuttingSessionBody body,
        CancellationToken ct)
    {
        var command = new CreateCuttingSessionCommand(
            gemId,
            body.SessionDate,
            body.Stage,
            body.HoursSpent,
            body.Notes);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    /// <summary>Update a cutting session.</summary>
    [HttpPut("cutting-sessions/{id:guid}")]
    public async Task<IActionResult> UpdateSession(
        Guid id,
        [FromBody] UpdateCuttingSessionBody body,
        CancellationToken ct)
    {
        await mediator.Send(new UpdateCuttingSessionCommand(
            id,
            body.SessionDate,
            body.Stage,
            body.HoursSpent,
            body.Notes), ct);
        return NoContent();
    }

    /// <summary>Delete a cutting session.</summary>
    [HttpDelete("cutting-sessions/{id:guid}")]
    public async Task<IActionResult> DeleteSession(Guid id, CancellationToken ct)
    {
        await mediator.Send(new DeleteCuttingSessionCommand(id), ct);
        return NoContent();
    }
}

public record AddCuttingSessionBody(
    DateTime SessionDate,
    CuttingStage Stage,
    decimal? HoursSpent,
    string? Notes);

public record UpdateCuttingSessionBody(
    DateTime SessionDate,
    CuttingStage Stage,
    decimal? HoursSpent,
    string? Notes);
