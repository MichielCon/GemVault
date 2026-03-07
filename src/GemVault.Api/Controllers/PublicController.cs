using GemVault.Application.Public.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GemVault.Api.Controllers;

[ApiController]
[Route("api/v1/public")]
[AllowAnonymous]
public class PublicController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Resolves a public scan token (from QR code or RFID) and returns
    /// the public-safe view of the gem or parcel. No authentication required.
    /// Returns 404 for missing, inactive, or non-public records.
    /// </summary>
    [HttpGet("{token}")]
    public async Task<IActionResult> GetByToken(string token, CancellationToken ct)
    {
        var result = await mediator.Send(new GetPublicRecordQuery(token), ct);
        return Ok(result);
    }
}
