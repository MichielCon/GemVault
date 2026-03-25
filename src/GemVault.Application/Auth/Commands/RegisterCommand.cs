using FluentValidation;
using GemVault.Application.Auth.DTOs;
using GemVault.Application.Common.Options;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using GemVault.Domain.Enums;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;
using ValidationException = GemVault.Application.Common.Exceptions.ValidationException;

namespace GemVault.Application.Auth.Commands;

public record RegisterCommand(string Email, string Password, UserRole Role = UserRole.Collector)
    : IRequest<AuthResponseDto>;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(10).MaximumLength(128);
        RuleFor(x => x.Role)
            .Must(r => r == UserRole.Collector || r == UserRole.Business)
            .WithMessage("Role must be Collector or Business. Admin accounts must be assigned by a system administrator.");
    }
}

public class RegisterCommandHandler(
    IIdentityService identityService,
    IJwtService jwtService,
    IApplicationDbContext context,
    IOptions<JwtOptions> jwtOptions,
    ILogger<RegisterCommandHandler> logger)
    : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken ct)
    {
        if (await identityService.UserExistsAsync(request.Email, ct))
            throw new ValidationException("Email is already registered.");

        var (userId, errors) = await identityService.CreateUserAsync(
            request.Email, request.Password, request.Role, ct);

        if (errors.Count > 0)
            throw new ValidationException(string.Join("; ", errors));

        // Generate email confirmation token
        // TODO: Send confirmation email via SMTP when email service is configured.
        var (_, _) = await identityService.GenerateEmailConfirmationTokenAsync(userId, ct);
        logger.LogInformation("Email confirmation required for {Email}", request.Email);

        return await IssueTokensAsync(userId, request.Email, request.Role, ct);
    }

    private async Task<AuthResponseDto> IssueTokensAsync(
        Guid userId, string email, UserRole role, CancellationToken ct)
    {
        var accessToken = jwtService.GenerateAccessToken(userId, email, role, false);
        var rawRefresh = jwtService.GenerateRefreshToken();

        context.RefreshTokens.Add(new RefreshToken
        {
            UserId = userId,
            TokenHash = HashToken(rawRefresh),
            ExpiresAt = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshExpiryDays),
        });
        await context.SaveChangesAsync(ct);

        return new AuthResponseDto(accessToken, rawRefresh, userId, email, role);
    }

    internal static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}

