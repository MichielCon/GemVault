using FluentValidation.TestHelper;
using GemVault.Application.Auth.Commands;
using GemVault.Domain.Enums;

namespace GemVault.Tests.Unit.Application;

public class RegisterCommandValidatorTests
{
    private readonly RegisterCommandValidator _validator = new();

    [Fact]
    public void Validate_ValidCommand_PassesValidation()
    {
        var command = new RegisterCommand("user@example.com", "SecurePass1", UserRole.Collector);

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyEmail_FailsValidation()
    {
        var command = new RegisterCommand("", "SecurePass1");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Validate_InvalidEmail_FailsValidation()
    {
        var command = new RegisterCommand("not-an-email", "SecurePass1");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Validate_ShortPassword_FailsValidation()
    {
        var command = new RegisterCommand("user@example.com", "short");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Validate_EmptyPassword_FailsValidation()
    {
        var command = new RegisterCommand("user@example.com", "");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Password);
    }
}
