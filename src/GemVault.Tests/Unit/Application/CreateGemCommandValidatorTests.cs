using FluentValidation.TestHelper;
using GemVault.Application.Gems.Commands;

namespace GemVault.Tests.Unit.Application;

public class CreateGemCommandValidatorTests
{
    private readonly CreateGemCommandValidator _validator = new();

    private static CreateGemCommand ValidCommand() => new(
        Name: "Ruby",
        Species: null,
        Variety: null,
        WeightCarats: null,
        Color: null,
        Clarity: null,
        Cut: null,
        Treatment: null,
        Shape: null,
        LengthMm: null,
        WidthMm: null,
        HeightMm: null,
        PurchasePrice: null,
        Notes: null,
        IsPublic: false,
        OriginId: null,
        Attributes: null);

    [Fact]
    public void Validate_ValidCommand_PassesValidation()
    {
        var result = _validator.TestValidate(ValidCommand());

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyName_FailsValidation()
    {
        var command = ValidCommand() with { Name = "" };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_NameTooLong_FailsValidation()
    {
        var command = ValidCommand() with { Name = new string('A', 201) };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_NegativeWeight_FailsValidation()
    {
        var command = ValidCommand() with { WeightCarats = -0.5m };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.WeightCarats);
    }

    [Fact]
    public void Validate_NullWeight_PassesValidation()
    {
        var command = ValidCommand() with { WeightCarats = null };

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveValidationErrorFor(x => x.WeightCarats);
    }

    [Fact]
    public void Validate_NegativePurchasePrice_FailsValidation()
    {
        var command = ValidCommand() with { PurchasePrice = -1m };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.PurchasePrice);
    }

    [Fact]
    public void Validate_ZeroPurchasePrice_PassesValidation()
    {
        var command = ValidCommand() with { PurchasePrice = 0m };

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveValidationErrorFor(x => x.PurchasePrice);
    }
}
