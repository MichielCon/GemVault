using GemVault.Application.Admin.Commands;
using GemVault.Application.Admin.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1/admin")]
[Authorize(Roles = "Admin")]
public class AdminController(IMediator mediator) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken ct)
    {
        var result = await mediator.Send(new GetAdminStatsQuery(), ct);
        return Ok(result);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? role = null,
        [FromQuery] bool? isDeleted = null,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(new GetAdminUsersQuery(page, pageSize, search, role, isDeleted), ct);
        return Ok(result);
    }

    [HttpPut("users/{id:guid}/role")]
    public async Task<IActionResult> ChangeRole(Guid id, [FromBody] ChangeRoleBody body, CancellationToken ct)
    {
        await mediator.Send(new ChangeUserRoleCommand(id, body.Role), ct);
        return NoContent();
    }

    [HttpPut("users/{id:guid}/deactivate")]
    public async Task<IActionResult> DeactivateUser(Guid id, CancellationToken ct)
    {
        await mediator.Send(new SetUserActiveCommand(id, true), ct);
        return NoContent();
    }

    [HttpPut("users/{id:guid}/reactivate")]
    public async Task<IActionResult> ReactivateUser(Guid id, CancellationToken ct)
    {
        await mediator.Send(new SetUserActiveCommand(id, false), ct);
        return NoContent();
    }

    [HttpDelete("users/{id:guid}/sessions")]
    public async Task<IActionResult> RevokeUserSessions(Guid id, CancellationToken ct)
    {
        var count = await mediator.Send(new RevokeUserSessionsCommand(id), ct);
        return Ok(new { revokedCount = count });
    }

    [HttpGet("sessions")]
    public async Task<IActionResult> GetSessions(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(new GetAdminSessionsQuery(page, pageSize, search), ct);
        return Ok(result);
    }

    [HttpDelete("sessions/{id:guid}")]
    public async Task<IActionResult> RevokeSession(Guid id, CancellationToken ct)
    {
        await mediator.Send(new RevokeSessionCommand(id), ct);
        return NoContent();
    }

    [HttpGet("public-tokens")]
    public async Task<IActionResult> GetPublicTokens(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool? isActive = null,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(new GetAdminPublicTokensQuery(page, pageSize, isActive), ct);
        return Ok(result);
    }

    [HttpPut("public-tokens/{id:guid}/toggle")]
    public async Task<IActionResult> TogglePublicToken(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new TogglePublicTokenCommand(id), ct);
        return Ok(result);
    }

    [HttpGet("photos")]
    public async Task<IActionResult> GetPhotos(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(new GetAdminPhotosQuery(page, pageSize, search), ct);
        return Ok(result);
    }

    [HttpDelete("photos/{id:guid}")]
    public async Task<IActionResult> DeletePhoto(Guid id, CancellationToken ct)
    {
        await mediator.Send(new AdminDeletePhotoCommand(id), ct);
        return NoContent();
    }

    [HttpGet("certificates")]
    public async Task<IActionResult> GetCertificates(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(new GetAdminCertificatesQuery(page, pageSize, search), ct);
        return Ok(result);
    }

    [HttpDelete("certificates/{id:guid}")]
    public async Task<IActionResult> DeleteCertificate(Guid id, CancellationToken ct)
    {
        await mediator.Send(new AdminDeleteCertificateCommand(id), ct);
        return NoContent();
    }
}

public record ChangeRoleBody(string Role);
