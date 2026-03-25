using GemVault.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GemVault.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260325000000_MakeOriginCountryLocalityUnique")]
    /// <inheritdoc />
    public partial class MakeOriginCountryLocalityUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Remove duplicate (Country, Locality) rows, keeping the one with the lowest Id per group.
            // Re-point any Gem/GemParcel OriginId references to the surviving row before deleting.
            migrationBuilder.Sql("""
                UPDATE "Gems" g
                SET "OriginId" = keeper."Id"
                FROM (
                    SELECT DISTINCT ON ("Country", "Locality") "Id", "Country", "Locality"
                    FROM "Origins"
                    WHERE "IsDeleted" = FALSE
                    ORDER BY "Country", "Locality", "Id"
                ) keeper
                JOIN "Origins" dup ON dup."Country" = keeper."Country"
                    AND (dup."Locality" = keeper."Locality" OR (dup."Locality" IS NULL AND keeper."Locality" IS NULL))
                    AND dup."Id" <> keeper."Id"
                    AND dup."IsDeleted" = FALSE
                WHERE g."OriginId" = dup."Id";
                """);

            migrationBuilder.Sql("""
                UPDATE "GemParcels" gp
                SET "OriginId" = keeper."Id"
                FROM (
                    SELECT DISTINCT ON ("Country", "Locality") "Id", "Country", "Locality"
                    FROM "Origins"
                    WHERE "IsDeleted" = FALSE
                    ORDER BY "Country", "Locality", "Id"
                ) keeper
                JOIN "Origins" dup ON dup."Country" = keeper."Country"
                    AND (dup."Locality" = keeper."Locality" OR (dup."Locality" IS NULL AND keeper."Locality" IS NULL))
                    AND dup."Id" <> keeper."Id"
                    AND dup."IsDeleted" = FALSE
                WHERE gp."OriginId" = dup."Id";
                """);

            // Soft-delete duplicate origins (keep the lowest Id per group).
            migrationBuilder.Sql("""
                UPDATE "Origins"
                SET "IsDeleted" = TRUE
                WHERE "Id" NOT IN (
                    SELECT DISTINCT ON ("Country", "Locality") "Id"
                    FROM "Origins"
                    WHERE "IsDeleted" = FALSE
                    ORDER BY "Country", "Locality", "Id"
                )
                AND "IsDeleted" = FALSE;
                """);

            migrationBuilder.DropIndex(
                name: "IX_Origins_Country_Locality",
                table: "Origins");

            // Partial unique index: only enforce uniqueness on non-deleted rows.
            migrationBuilder.Sql("""
                CREATE UNIQUE INDEX "IX_Origins_Country_Locality"
                ON "Origins" ("Country", "Locality")
                WHERE "IsDeleted" = FALSE;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DROP INDEX IF EXISTS "IX_Origins_Country_Locality";""");

            migrationBuilder.CreateIndex(
                name: "IX_Origins_Country_Locality",
                table: "Origins",
                columns: new[] { "Country", "Locality" });
        }
    }
}
