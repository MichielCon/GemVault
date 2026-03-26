using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GemVault.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddConsignmentFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConsigneeContact",
                table: "Gems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConsigneeName",
                table: "Gems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "ConsignmentDate",
                table: "Gems",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "ConsignmentReturnDate",
                table: "Gems",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ConsignmentTargetPrice",
                table: "Gems",
                type: "numeric",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConsigneeContact",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "ConsigneeName",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "ConsignmentDate",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "ConsignmentReturnDate",
                table: "Gems");

            migrationBuilder.DropColumn(
                name: "ConsignmentTargetPrice",
                table: "Gems");
        }
    }
}
