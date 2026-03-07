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
            await HandleExceptionAsync(context, ex, logger);
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context, Exception exception, ILogger logger)
    {
        var (status, title, errors) = exception switch
        {
            ValidationException ve => (400, "Validation Error", ve.Errors),
            NotFoundException nfe => (404, nfe.Message, (IDictionary<string, string[]>?)null),
            ForbiddenException => (403, "Forbidden", (IDictionary<string, string[]>?)null),
            _ => (500, "An unexpected error occurred.", (IDictionary<string, string[]>?)null),
        };

        if (status == 500)
            logger.LogError(exception, "Unhandled exception");

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";

        var body = new
        {
            status,
            title,
            errors,
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(body,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
