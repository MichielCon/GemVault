using GemVault.Application.Vocabulary;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1/vocabulary")]
[AllowAnonymous]
public class VocabularyController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet("{field}")]
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
}
