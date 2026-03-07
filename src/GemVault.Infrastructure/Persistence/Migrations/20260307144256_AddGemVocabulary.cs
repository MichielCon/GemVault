using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GemVault.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGemVocabulary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GemVocabularies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Field = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Value = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ParentValue = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GemVocabularies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GemVocabularies_Field_Value",
                table: "GemVocabularies",
                columns: new[] { "Field", "Value" },
                unique: true);

            migrationBuilder.Sql(@"
INSERT INTO ""GemVocabularies"" (""Field"", ""Value"", ""ParentValue"", ""SortOrder"") VALUES
-- Species
('species', 'Corundum', NULL, 1),
('species', 'Beryl', NULL, 2),
('species', 'Diamond', NULL, 3),
('species', 'Garnet', NULL, 4),
('species', 'Tourmaline', NULL, 5),
('species', 'Spinel', NULL, 6),
('species', 'Chrysoberyl', NULL, 7),
('species', 'Quartz', NULL, 8),
('species', 'Opal', NULL, 9),
('species', 'Zoisite', NULL, 10),
('species', 'Topaz', NULL, 11),
('species', 'Peridot', NULL, 12),
('species', 'Zircon', NULL, 13),
('species', 'Feldspar', NULL, 14),
('species', 'Jade', NULL, 15),
('species', 'Lapis Lazuli', NULL, 16),
('species', 'Turquoise', NULL, 17),
('species', 'Pearl', NULL, 18),
('species', 'Amber', NULL, 19),
('species', 'Coral', NULL, 20),
('species', 'Malachite', NULL, 21),
('species', 'Pyrite', NULL, 22),
('species', 'Rhodonite', NULL, 23),
('species', 'Labradorite', NULL, 24),
('species', 'Iolite', NULL, 25),
('species', 'Apatite', NULL, 26),
('species', 'Sphene', NULL, 27),
('species', 'Demantoid', NULL, 28),
('species', 'Tsavorite', NULL, 29),
-- Varieties: Corundum
('variety', 'Sapphire', 'Corundum', 1),
('variety', 'Ruby', 'Corundum', 2),
('variety', 'Padparadscha', 'Corundum', 3),
('variety', 'Star Sapphire', 'Corundum', 4),
('variety', 'Star Ruby', 'Corundum', 5),
-- Varieties: Beryl
('variety', 'Emerald', 'Beryl', 1),
('variety', 'Aquamarine', 'Beryl', 2),
('variety', 'Morganite', 'Beryl', 3),
('variety', 'Heliodor', 'Beryl', 4),
('variety', 'Goshenite', 'Beryl', 5),
('variety', 'Red Beryl', 'Beryl', 6),
-- Varieties: Garnet
('variety', 'Almandine', 'Garnet', 1),
('variety', 'Pyrope', 'Garnet', 2),
('variety', 'Spessartine', 'Garnet', 3),
('variety', 'Grossular', 'Garnet', 4),
('variety', 'Tsavorite', 'Garnet', 5),
('variety', 'Demantoid', 'Garnet', 6),
('variety', 'Rhodolite', 'Garnet', 7),
('variety', 'Hessonite', 'Garnet', 8),
('variety', 'Malaya', 'Garnet', 9),
('variety', 'Color-Change Garnet', 'Garnet', 10),
('variety', 'Mandarin Garnet', 'Garnet', 11),
-- Varieties: Tourmaline
('variety', 'Indicolite', 'Tourmaline', 1),
('variety', 'Rubellite', 'Tourmaline', 2),
('variety', 'Paraiba', 'Tourmaline', 3),
('variety', 'Chrome Tourmaline', 'Tourmaline', 4),
('variety', 'Bi-Color', 'Tourmaline', 5),
('variety', 'Watermelon', 'Tourmaline', 6),
('variety', 'Verdelite', 'Tourmaline', 7),
('variety', 'Schorl', 'Tourmaline', 8),
-- Varieties: Chrysoberyl
('variety', 'Alexandrite', 'Chrysoberyl', 1),
('variety', 'Cat''s Eye', 'Chrysoberyl', 2),
('variety', 'Yellow Chrysoberyl', 'Chrysoberyl', 3),
-- Varieties: Quartz
('variety', 'Amethyst', 'Quartz', 1),
('variety', 'Citrine', 'Quartz', 2),
('variety', 'Ametrine', 'Quartz', 3),
('variety', 'Rose Quartz', 'Quartz', 4),
('variety', 'Smoky Quartz', 'Quartz', 5),
('variety', 'Rock Crystal', 'Quartz', 6),
('variety', 'Rutilated Quartz', 'Quartz', 7),
('variety', 'Tiger''s Eye', 'Quartz', 8),
-- Varieties: Opal
('variety', 'White Opal', 'Opal', 1),
('variety', 'Black Opal', 'Opal', 2),
('variety', 'Fire Opal', 'Opal', 3),
('variety', 'Boulder Opal', 'Opal', 4),
('variety', 'Crystal Opal', 'Opal', 5),
('variety', 'Matrix Opal', 'Opal', 6),
-- Varieties: Zoisite
('variety', 'Tanzanite', 'Zoisite', 1),
('variety', 'Anyolite', 'Zoisite', 2),
-- Varieties: Topaz
('variety', 'Imperial Topaz', 'Topaz', 1),
('variety', 'Blue Topaz', 'Topaz', 2),
('variety', 'White Topaz', 'Topaz', 3),
('variety', 'Pink Topaz', 'Topaz', 4),
-- Varieties: Feldspar
('variety', 'Moonstone', 'Feldspar', 1),
('variety', 'Labradorite', 'Feldspar', 2),
('variety', 'Sunstone', 'Feldspar', 3),
('variety', 'Amazonite', 'Feldspar', 4),
('variety', 'Spectrolite', 'Feldspar', 5),
-- Varieties: Jade
('variety', 'Jadeite', 'Jade', 1),
('variety', 'Nephrite', 'Jade', 2),
-- Varieties: Spinel
('variety', 'Red Spinel', 'Spinel', 1),
('variety', 'Blue Spinel', 'Spinel', 2),
('variety', 'Pink Spinel', 'Spinel', 3),
('variety', 'Black Spinel', 'Spinel', 4),
-- Varieties: Diamond
('variety', 'White Diamond', 'Diamond', 1),
('variety', 'Yellow Diamond', 'Diamond', 2),
('variety', 'Brown Diamond', 'Diamond', 3),
('variety', 'Pink Diamond', 'Diamond', 4),
('variety', 'Blue Diamond', 'Diamond', 5),
('variety', 'Green Diamond', 'Diamond', 6),
('variety', 'Black Diamond', 'Diamond', 7),
-- Colors
('color', 'Colorless', NULL, 1),
('color', 'White', NULL, 2),
('color', 'Light Yellow', NULL, 3),
('color', 'Yellow', NULL, 4),
('color', 'Orange', NULL, 5),
('color', 'Padparadscha', NULL, 6),
('color', 'Salmon', NULL, 7),
('color', 'Light Pink', NULL, 8),
('color', 'Pink', NULL, 9),
('color', 'Hot Pink', NULL, 10),
('color', 'Red', NULL, 11),
('color', 'Purplish Red', NULL, 12),
('color', 'Light Purple', NULL, 13),
('color', 'Purple', NULL, 14),
('color', 'Violet', NULL, 15),
('color', 'Light Blue', NULL, 16),
('color', 'Blue', NULL, 17),
('color', 'Dark Blue', NULL, 18),
('color', 'Teal', NULL, 19),
('color', 'Light Green', NULL, 20),
('color', 'Green', NULL, 21),
('color', 'Dark Green', NULL, 22),
('color', 'Chrome Green', NULL, 23),
('color', 'Brown', NULL, 24),
('color', 'Golden', NULL, 25),
('color', 'Cognac', NULL, 26),
('color', 'Gray', NULL, 27),
('color', 'Black', NULL, 28),
('color', 'Multi-Color', NULL, 29),
('color', 'Parti-Color', NULL, 30),
('color', 'Color-Change', NULL, 31),
-- Clarities
('clarity', 'Loupe Clean', NULL, 1),
('clarity', 'Eye Clean', NULL, 2),
('clarity', 'Slightly Included (SI)', NULL, 3),
('clarity', 'Moderately Included (MI)', NULL, 4),
('clarity', 'Heavily Included (HI)', NULL, 5),
('clarity', 'Opaque', NULL, 6),
-- Cuts
('cut', 'Round Brilliant', NULL, 1),
('cut', 'Oval Brilliant', NULL, 2),
('cut', 'Cushion Brilliant', NULL, 3),
('cut', 'Cushion Mixed', NULL, 4),
('cut', 'Emerald Cut', NULL, 5),
('cut', 'Princess', NULL, 6),
('cut', 'Pear', NULL, 7),
('cut', 'Marquise', NULL, 8),
('cut', 'Heart', NULL, 9),
('cut', 'Radiant', NULL, 10),
('cut', 'Asscher', NULL, 11),
('cut', 'Step Cut', NULL, 12),
('cut', 'Rose Cut', NULL, 13),
('cut', 'Cabochon', NULL, 14),
('cut', 'Briolette', NULL, 15),
('cut', 'Faceted Freeform', NULL, 16),
('cut', 'Carved', NULL, 17),
-- Shapes
('shape', 'Round', NULL, 1),
('shape', 'Oval', NULL, 2),
('shape', 'Cushion', NULL, 3),
('shape', 'Square', NULL, 4),
('shape', 'Rectangular', NULL, 5),
('shape', 'Pear', NULL, 6),
('shape', 'Marquise', NULL, 7),
('shape', 'Heart', NULL, 8),
('shape', 'Triangular', NULL, 9),
('shape', 'Hexagonal', NULL, 10),
('shape', 'Octagonal', NULL, 11),
('shape', 'Freeform', NULL, 12),
-- Treatments
('treatment', 'None', NULL, 1),
('treatment', 'Heat Treatment', NULL, 2),
('treatment', 'Fracture Filling', NULL, 3),
('treatment', 'Beryllium Diffusion', NULL, 4),
('treatment', 'Lattice Diffusion', NULL, 5),
('treatment', 'Flux Healing', NULL, 6),
('treatment', 'Irradiation', NULL, 7),
('treatment', 'Coating', NULL, 8),
('treatment', 'Oiling', NULL, 9),
('treatment', 'Resin Filling', NULL, 10),
('treatment', 'HPHT', NULL, 11),
('treatment', 'Laser Drilling', NULL, 12),
('treatment', 'Bleaching', NULL, 13),
('treatment', 'Unknown', NULL, 14)
;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM ""GemVocabularies"";");

            migrationBuilder.DropTable(
                name: "GemVocabularies");
        }
    }
}
