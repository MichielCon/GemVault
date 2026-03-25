using GemVault.Application.Common.Exceptions;
using System.Text.Json;

namespace GemVault.Api.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? context.User.FindFirst("sub")?.Value
                     ?? "anonymous";
        var method = context.Request.Method;
        var path = context.Request.Path;

        var (status, title, errors) = exception switch
        {
            ValidationException ve => (400, "Validation Error", ve.Errors),
            NotFoundException nfe => (404, nfe.Message, (IDictionary<string, string[]>?)null),
            ForbiddenException => (403, "Forbidden", (IDictionary<string, string[]>?)null),
            _ => (500, "An unexpected error occurred.", (IDictionary<string, string[]>?)null),
        };

        switch (status)
        {
            case 403:
                logger.LogWarning("Forbidden: {UserId} on {Method} {Path}", userId, method, path);
                break;
            case 400:
                logger.LogDebug(exception, "Validation error for {UserId}", userId);
                break;
            case 404:
                logger.LogDebug("Not found: {Message}", exception.Message);
                break;
            default:
                logger.LogError(exception, "Unhandled exception for {UserId} on {Method} {Path}", userId, method, path);
                break;
        }

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";

        var body = new { status, title, errors };

        await context.Response.WriteAsync(JsonSerializer.Serialize(body,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
