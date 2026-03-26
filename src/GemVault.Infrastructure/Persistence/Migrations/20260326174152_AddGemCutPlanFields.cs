using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GemVault.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGemCutPlanFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CutPlanNotes",
                table: "Gems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RoughWeightCarats",
                table: "Gems",
                type: "numeric",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CutPlanNotes",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "RoughWeightCarats",
                table: "Gems");
        }
    }
}
