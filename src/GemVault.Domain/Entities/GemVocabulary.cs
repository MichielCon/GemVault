namespace GemVault.Domain.Entities;

public class GemVocabulary
{
    public int Id { get; set; }
    public string Field { get; set; } = string.Empty;      // e.g. "species", "variety", "color"
    public string Value { get; set; } = string.Empty;      // e.g. "Corundum", "Sapphire"
    public string? ParentValue { get; set; }               // For variety: the parent species name (e.g. "Corundum")
    public int SortOrder { get; set; }
}
