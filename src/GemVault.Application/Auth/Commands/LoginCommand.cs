using FluentValidation;
using GemVault.Application.Auth.DTOs;
using GemVault.Application.Common.Options;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Options;
using ValidationException = GemVault.Application.Common.Exceptions.ValidationException;
using static GemVault.Application.Auth.Commands.RegisterCommandHandler;

namespace GemVault.Application.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponseDto>;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}

public class LoginCommandHandler(
    IIdentityService identityService,
    IJwtService jwtService,
    IApplicationDbContext context,
    IOptions<JwtOptions> jwtOptions)
    : IRequestHandler<LoginCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken ct)
    {
        var (success, userId, email, role) = await identityService.ValidateCredentialsAsync(
            request.Email, request.Password, ct);

        if (!success)
            throw new ValidationException("Invalid email or password.");

        var emailConfirmed = await identityService.IsEmailConfirmedAsync(userId, ct);
        var accessToken = jwtService.GenerateAccessToken(userId, email, role, emailConfirmed);
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
}
