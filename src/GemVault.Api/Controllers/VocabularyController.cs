using GemVault.Application.Vocabulary;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1/vocabulary")]
[EnableRateLimiting("api")]
public class VocabularyController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet("{field}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(
        string field,
        [FromQuery] string? parentValue = null,
        CancellationToken ct = default)
    {
        Guid? userId = null;
        if (User.Identity?.IsAuthenticated == true)
            userId = currentUser.UserId;

        var result = await mediator.Send(new GetVocabularyQuery(field, userId, parentValue), ct);
        return Ok(result);
    }

    [HttpGet("{field}/admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdmin(string field, CancellationToken ct = default)
    {
        var result = await mediator.Send(new GetVocabularyAdminQuery(field), ct);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateVocabularyItemCommand command, CancellationToken ct = default)
    {
        var result = await mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetAdmin), new { field = result.Field }, result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateVocabularyItemCommand command, CancellationToken ct = default)
    {
        if (id != command.Id)
            return BadRequest("Route id does not match body id.");
        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        await mediator.Send(new DeleteVocabularyItemCommand(id), ct);
        return NoContent();
    }
}
