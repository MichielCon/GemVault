using GemVault.Application.Profile.Commands;
using GemVault.Application.Profile.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1/profile")]
[Authorize]
public class ProfileController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProfile(CancellationToken ct)
    {
        var result = await mediator.Send(new GetProfileQuery(), ct);
        return Ok(result);
    }

    [HttpGet("sessions")]
    public async Task<IActionResult> GetSessions(CancellationToken ct)
    {
        var result = await mediator.Send(new GetMySessionsQuery(), ct);
        return Ok(result);
    }

    [HttpPut("display-name")]
    public async Task<IActionResult> UpdateDisplayName([FromBody] UpdateDisplayNameBody body, CancellationToken ct)
    {
        await mediator.Send(new UpdateDisplayNameCommand(body.DisplayName), ct);
        return NoContent();
    }

    [HttpPut("email")]
    public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailBody body, CancellationToken ct)
    {
        await mediator.Send(new ChangeEmailCommand(body.CurrentPassword, body.NewEmail), ct);
        return NoContent();
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordBody body, CancellationToken ct)
    {
        await mediator.Send(new ChangePasswordCommand(body.CurrentPassword, body.NewPassword), ct);
        return NoContent();
    }

    [HttpDelete("sessions/{id:guid}")]
    public async Task<IActionResult> RevokeSession(Guid id, CancellationToken ct)
    {
        await mediator.Send(new RevokeMySessionCommand(id), ct);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountBody body, CancellationToken ct)
    {
        await mediator.Send(new DeleteAccountCommand(body.CurrentPassword), ct);
        return NoContent();
    }
}

public record UpdateDisplayNameBody(string? DisplayName);
public record ChangeEmailBody(string CurrentPassword, string NewEmail);
public record ChangePasswordBody(string CurrentPassword, string NewPassword);
public record DeleteAccountBody(string CurrentPassword);
