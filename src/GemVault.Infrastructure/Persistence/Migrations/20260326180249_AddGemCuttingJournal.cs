using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GemVault.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGemCuttingJournal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CrownAngle",
                table: "Gems",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CuttingDesign",
                table: "Gems",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PavilionAngle",
                table: "Gems",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlannedFacets",
                table: "Gems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TablePct",
                table: "Gems",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CuttingSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GemId = table.Column<Guid>(type: "uuid", nullable: false),
                    SessionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Stage = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    HoursSpent = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: true),
                    Notes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CuttingSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CuttingSessions_Gems_GemId",
                        column: x => x.GemId,
                        principalTable: "Gems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CuttingSessions_GemId",
                table: "CuttingSessions",
                column: "GemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CuttingSessions");

            migrationBuilder.DropColumn(
                name: "CrownAngle",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "CuttingDesign",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "PavilionAngle",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "PlannedFacets",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "TablePct",
                table: "Gems");
        }
    }
}
