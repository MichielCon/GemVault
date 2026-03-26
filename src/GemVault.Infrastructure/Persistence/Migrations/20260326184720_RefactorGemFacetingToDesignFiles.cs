using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GemVault.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RefactorGemFacetingToDesignFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CrownAngle",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "PavilionAngle",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "TablePct",
                table: "Gems");

            migrationBuilder.CreateTable(
                name: "DesignFiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GemId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ObjectKey = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ContentType = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DesignFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DesignFiles_Gems_GemId",
                        column: x => x.GemId,
                        principalTable: "Gems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DesignFiles_GemId",
                table: "DesignFiles",
                column: "GemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DesignFiles");

            migrationBuilder.AddColumn<decimal>(
                name: "CrownAngle",
                table: "Gems",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PavilionAngle",
                table: "Gems",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TablePct",
                table: "Gems",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: true);
        }
    }
}
