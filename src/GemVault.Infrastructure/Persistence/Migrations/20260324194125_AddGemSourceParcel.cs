using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GemVault.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGemSourceParcel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SourceParcelId",
                table: "Gems",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Gems_SourceParcelId",
                table: "Gems",
                column: "SourceParcelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Gems_GemParcels_SourceParcelId",
                table: "Gems",
                column: "SourceParcelId",
                principalTable: "GemParcels",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gems_GemParcels_SourceParcelId",
                table: "Gems");

            migrationBuilder.DropIndex(
                name: "IX_Gems_SourceParcelId",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "SourceParcelId",
                table: "Gems");
        }
    }
}
