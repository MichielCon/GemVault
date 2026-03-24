using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GemVault.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SyncModelSnapshot : Migration
    {
        /// <summary>
        /// No-op migration — exists only to bring the EF model snapshot into sync
        /// after merging the RefactorOriginSchema worktree branch. All schema changes
        /// (Mine drop, Region→Locality rename, seed data) are in RefactorOriginSchema.
        /// </summary>
        protected override void Up(MigrationBuilder migrationBuilder) { }

        protected override void Down(MigrationBuilder migrationBuilder) { }
    }
}
