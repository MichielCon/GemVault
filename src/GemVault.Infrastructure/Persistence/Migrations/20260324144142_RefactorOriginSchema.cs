using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GemVault.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RefactorOriginSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Mine",
                table: "Origins");

            migrationBuilder.RenameColumn(
                name: "Region",
                table: "Origins",
                newName: "Locality");

            migrationBuilder.InsertData(
                table: "Origins",
                columns: new[] { "Id", "Country", "CreatedAt", "IsDeleted", "Locality", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("00000001-0000-0000-0000-000000000001"), "Afghanistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000001-0000-0000-0000-000000000002"), "Sri Lanka", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Ratnapura", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000002-0000-0000-0000-000000000001"), "Albania", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000002-0000-0000-0000-000000000002"), "Sri Lanka", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Elahera", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000003-0000-0000-0000-000000000001"), "Algeria", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000003-0000-0000-0000-000000000002"), "Myanmar", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Mogok", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000004-0000-0000-0000-000000000001"), "Andorra", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000004-0000-0000-0000-000000000002"), "Myanmar", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Mong Hsu", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000005-0000-0000-0000-000000000001"), "Angola", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000005-0000-0000-0000-000000000002"), "Myanmar", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Mandalay", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000006-0000-0000-0000-000000000001"), "Antigua and Barbuda", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000006-0000-0000-0000-000000000002"), "Colombia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Muzo", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000007-0000-0000-0000-000000000001"), "Argentina", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000007-0000-0000-0000-000000000002"), "Colombia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Chivor", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000008-0000-0000-0000-000000000001"), "Armenia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000008-0000-0000-0000-000000000002"), "Colombia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Coscuez", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000009-0000-0000-0000-000000000001"), "Australia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000009-0000-0000-0000-000000000002"), "Zambia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Kagem", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000010-0000-0000-0000-000000000001"), "Austria", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000010-0000-0000-0000-000000000002"), "Zambia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Kafubu", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000011-0000-0000-0000-000000000001"), "Azerbaijan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000011-0000-0000-0000-000000000002"), "Brazil", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Minas Gerais", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000012-0000-0000-0000-000000000001"), "Bahamas", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000012-0000-0000-0000-000000000002"), "Brazil", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Bahia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000013-0000-0000-0000-000000000001"), "Bahrain", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000013-0000-0000-0000-000000000002"), "Brazil", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Paraiba", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000014-0000-0000-0000-000000000001"), "Bangladesh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000014-0000-0000-0000-000000000002"), "Madagascar", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Ilakaka", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000015-0000-0000-0000-000000000001"), "Barbados", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000015-0000-0000-0000-000000000002"), "Madagascar", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Andilamena", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000016-0000-0000-0000-000000000001"), "Belarus", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000016-0000-0000-0000-000000000002"), "Tanzania", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Merelani", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000017-0000-0000-0000-000000000001"), "Belgium", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000017-0000-0000-0000-000000000002"), "Tanzania", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Tunduru", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000018-0000-0000-0000-000000000001"), "Belize", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000018-0000-0000-0000-000000000002"), "Tanzania", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Umba Valley", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000019-0000-0000-0000-000000000001"), "Benin", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000019-0000-0000-0000-000000000002"), "Kenya", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Tsavo", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000020-0000-0000-0000-000000000001"), "Bhutan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000020-0000-0000-0000-000000000002"), "Kenya", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Baringo", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000021-0000-0000-0000-000000000001"), "Bolivia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000021-0000-0000-0000-000000000002"), "Afghanistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Jegdalek", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000022-0000-0000-0000-000000000001"), "Bosnia and Herzegovina", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000022-0000-0000-0000-000000000002"), "Afghanistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Panjshir Valley", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000023-0000-0000-0000-000000000001"), "Botswana", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000023-0000-0000-0000-000000000002"), "Pakistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Hunza Valley", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000024-0000-0000-0000-000000000001"), "Brazil", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000024-0000-0000-0000-000000000002"), "Pakistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Swat Valley", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000025-0000-0000-0000-000000000001"), "Brunei", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000025-0000-0000-0000-000000000002"), "Pakistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Chitral", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000026-0000-0000-0000-000000000001"), "Bulgaria", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000026-0000-0000-0000-000000000002"), "India", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Jaipur", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000027-0000-0000-0000-000000000001"), "Burkina Faso", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000027-0000-0000-0000-000000000002"), "India", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Panna", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000028-0000-0000-0000-000000000001"), "Burundi", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000028-0000-0000-0000-000000000002"), "India", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Kashmir", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000029-0000-0000-0000-000000000001"), "Cabo Verde", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000029-0000-0000-0000-000000000002"), "Russia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Ural Mountains", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000030-0000-0000-0000-000000000001"), "Cambodia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000030-0000-0000-0000-000000000002"), "Russia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Siberia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000031-0000-0000-0000-000000000001"), "Cameroon", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000031-0000-0000-0000-000000000002"), "Australia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Lightning Ridge", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000032-0000-0000-0000-000000000001"), "Canada", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000032-0000-0000-0000-000000000002"), "Australia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Coober Pedy", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000033-0000-0000-0000-000000000001"), "Central African Republic", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000033-0000-0000-0000-000000000002"), "Australia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Argyle", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000034-0000-0000-0000-000000000001"), "Chad", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000034-0000-0000-0000-000000000002"), "Cambodia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Pailin", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000035-0000-0000-0000-000000000001"), "Chile", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000035-0000-0000-0000-000000000002"), "Thailand", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Chanthaburi", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000036-0000-0000-0000-000000000001"), "China", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000036-0000-0000-0000-000000000002"), "Thailand", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Kanchanaburi", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000037-0000-0000-0000-000000000001"), "Colombia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000037-0000-0000-0000-000000000002"), "Vietnam", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Luc Yen", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000038-0000-0000-0000-000000000001"), "Comoros", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000038-0000-0000-0000-000000000002"), "Vietnam", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Quy Chau", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000039-0000-0000-0000-000000000001"), "Democratic Republic of Congo", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000039-0000-0000-0000-000000000002"), "China", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Yunnan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000040-0000-0000-0000-000000000001"), "Republic of Congo", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000040-0000-0000-0000-000000000002"), "China", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Xinjiang", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000041-0000-0000-0000-000000000001"), "Costa Rica", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000041-0000-0000-0000-000000000002"), "Ethiopia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Welo", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000042-0000-0000-0000-000000000001"), "Croatia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000042-0000-0000-0000-000000000002"), "Ethiopia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Shewa", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000043-0000-0000-0000-000000000001"), "Cuba", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000043-0000-0000-0000-000000000002"), "Nigeria", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Jos Plateau", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000044-0000-0000-0000-000000000001"), "Cyprus", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000044-0000-0000-0000-000000000002"), "Nigeria", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Kaduna", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000045-0000-0000-0000-000000000001"), "Czech Republic", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000045-0000-0000-0000-000000000002"), "Mozambique", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Montepuez", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000046-0000-0000-0000-000000000001"), "Denmark", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000046-0000-0000-0000-000000000002"), "Democratic Republic of Congo", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Mbuji-Mayi", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000047-0000-0000-0000-000000000001"), "Djibouti", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000047-0000-0000-0000-000000000002"), "Democratic Republic of Congo", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Katanga", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000048-0000-0000-0000-000000000001"), "Dominica", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000048-0000-0000-0000-000000000002"), "Zimbabwe", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Sandawana", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000049-0000-0000-0000-000000000001"), "Dominican Republic", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000049-0000-0000-0000-000000000002"), "South Africa", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Kimberley", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000050-0000-0000-0000-000000000001"), "Ecuador", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000050-0000-0000-0000-000000000002"), "South Africa", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Messina", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000051-0000-0000-0000-000000000001"), "Egypt", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000051-0000-0000-0000-000000000002"), "Canada", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "British Columbia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000052-0000-0000-0000-000000000001"), "El Salvador", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000052-0000-0000-0000-000000000002"), "United States", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Montana", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000053-0000-0000-0000-000000000001"), "Equatorial Guinea", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000053-0000-0000-0000-000000000002"), "United States", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "California", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000054-0000-0000-0000-000000000001"), "Eritrea", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000054-0000-0000-0000-000000000002"), "United States", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "North Carolina", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000055-0000-0000-0000-000000000001"), "Estonia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000055-0000-0000-0000-000000000002"), "Mexico", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Guerrero", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000056-0000-0000-0000-000000000001"), "Eswatini", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000056-0000-0000-0000-000000000002"), "Peru", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Pisco", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000057-0000-0000-0000-000000000001"), "Ethiopia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000057-0000-0000-0000-000000000002"), "Bolivia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Anahi Mine", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000058-0000-0000-0000-000000000001"), "Fiji", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000058-0000-0000-0000-000000000002"), "Iran", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Nishapur", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000059-0000-0000-0000-000000000001"), "Finland", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000059-0000-0000-0000-000000000002"), "Turkey", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Milas", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000060-0000-0000-0000-000000000001"), "France", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000060-0000-0000-0000-000000000002"), "Tajikistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Pamir Mountains", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000061-0000-0000-0000-000000000001"), "Gabon", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000061-0000-0000-0000-000000000002"), "Nepal", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Ganesh Himal", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000062-0000-0000-0000-000000000001"), "Gambia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000062-0000-0000-0000-000000000002"), "Indonesia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Kalimantan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000063-0000-0000-0000-000000000001"), "Georgia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000063-0000-0000-0000-000000000002"), "Philippines", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Palawan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000064-0000-0000-0000-000000000001"), "Germany", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000064-0000-0000-0000-000000000002"), "Laos", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Vang Vieng", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000065-0000-0000-0000-000000000001"), "Ghana", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000066-0000-0000-0000-000000000001"), "Greece", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000067-0000-0000-0000-000000000001"), "Grenada", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000068-0000-0000-0000-000000000001"), "Guatemala", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000069-0000-0000-0000-000000000001"), "Guinea", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000070-0000-0000-0000-000000000001"), "Guinea-Bissau", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000071-0000-0000-0000-000000000001"), "Guyana", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000072-0000-0000-0000-000000000001"), "Haiti", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000073-0000-0000-0000-000000000001"), "Honduras", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000074-0000-0000-0000-000000000001"), "Hungary", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000075-0000-0000-0000-000000000001"), "Iceland", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000076-0000-0000-0000-000000000001"), "India", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000077-0000-0000-0000-000000000001"), "Indonesia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000078-0000-0000-0000-000000000001"), "Iran", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000079-0000-0000-0000-000000000001"), "Iraq", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000080-0000-0000-0000-000000000001"), "Ireland", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000081-0000-0000-0000-000000000001"), "Israel", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000082-0000-0000-0000-000000000001"), "Italy", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000083-0000-0000-0000-000000000001"), "Jamaica", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000084-0000-0000-0000-000000000001"), "Japan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000085-0000-0000-0000-000000000001"), "Jordan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000086-0000-0000-0000-000000000001"), "Kazakhstan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000087-0000-0000-0000-000000000001"), "Kenya", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000088-0000-0000-0000-000000000001"), "Kiribati", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000089-0000-0000-0000-000000000001"), "Kuwait", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000090-0000-0000-0000-000000000001"), "Kyrgyzstan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000091-0000-0000-0000-000000000001"), "Laos", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000092-0000-0000-0000-000000000001"), "Latvia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000093-0000-0000-0000-000000000001"), "Lebanon", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000094-0000-0000-0000-000000000001"), "Lesotho", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000095-0000-0000-0000-000000000001"), "Liberia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000096-0000-0000-0000-000000000001"), "Libya", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000097-0000-0000-0000-000000000001"), "Liechtenstein", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000098-0000-0000-0000-000000000001"), "Lithuania", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000099-0000-0000-0000-000000000001"), "Luxembourg", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000100-0000-0000-0000-000000000001"), "Madagascar", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000101-0000-0000-0000-000000000001"), "Malawi", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000102-0000-0000-0000-000000000001"), "Malaysia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000103-0000-0000-0000-000000000001"), "Maldives", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000104-0000-0000-0000-000000000001"), "Mali", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000105-0000-0000-0000-000000000001"), "Malta", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000106-0000-0000-0000-000000000001"), "Marshall Islands", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000107-0000-0000-0000-000000000001"), "Mauritania", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000108-0000-0000-0000-000000000001"), "Mauritius", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000109-0000-0000-0000-000000000001"), "Mexico", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000110-0000-0000-0000-000000000001"), "Micronesia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000111-0000-0000-0000-000000000001"), "Moldova", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000112-0000-0000-0000-000000000001"), "Monaco", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000113-0000-0000-0000-000000000001"), "Mongolia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000114-0000-0000-0000-000000000001"), "Montenegro", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000115-0000-0000-0000-000000000001"), "Morocco", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000116-0000-0000-0000-000000000001"), "Mozambique", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000117-0000-0000-0000-000000000001"), "Myanmar", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000118-0000-0000-0000-000000000001"), "Namibia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000119-0000-0000-0000-000000000001"), "Nauru", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000120-0000-0000-0000-000000000001"), "Nepal", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000121-0000-0000-0000-000000000001"), "Netherlands", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000122-0000-0000-0000-000000000001"), "New Zealand", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000123-0000-0000-0000-000000000001"), "Nicaragua", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000124-0000-0000-0000-000000000001"), "Niger", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000125-0000-0000-0000-000000000001"), "Nigeria", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000126-0000-0000-0000-000000000001"), "North Korea", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000127-0000-0000-0000-000000000001"), "North Macedonia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000128-0000-0000-0000-000000000001"), "Norway", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000129-0000-0000-0000-000000000001"), "Oman", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000130-0000-0000-0000-000000000001"), "Pakistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000131-0000-0000-0000-000000000001"), "Palau", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000132-0000-0000-0000-000000000001"), "Palestine", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000133-0000-0000-0000-000000000001"), "Panama", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000134-0000-0000-0000-000000000001"), "Papua New Guinea", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000135-0000-0000-0000-000000000001"), "Paraguay", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000136-0000-0000-0000-000000000001"), "Peru", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000137-0000-0000-0000-000000000001"), "Philippines", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000138-0000-0000-0000-000000000001"), "Poland", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000139-0000-0000-0000-000000000001"), "Portugal", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000140-0000-0000-0000-000000000001"), "Qatar", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000141-0000-0000-0000-000000000001"), "Romania", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000142-0000-0000-0000-000000000001"), "Russia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000143-0000-0000-0000-000000000001"), "Rwanda", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000144-0000-0000-0000-000000000001"), "Saint Kitts and Nevis", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000145-0000-0000-0000-000000000001"), "Saint Lucia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000146-0000-0000-0000-000000000001"), "Saint Vincent and the Grenadines", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000147-0000-0000-0000-000000000001"), "Samoa", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000148-0000-0000-0000-000000000001"), "San Marino", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000149-0000-0000-0000-000000000001"), "Sao Tome and Principe", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000150-0000-0000-0000-000000000001"), "Saudi Arabia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000151-0000-0000-0000-000000000001"), "Senegal", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000152-0000-0000-0000-000000000001"), "Serbia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000153-0000-0000-0000-000000000001"), "Seychelles", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000154-0000-0000-0000-000000000001"), "Sierra Leone", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000155-0000-0000-0000-000000000001"), "Singapore", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000156-0000-0000-0000-000000000001"), "Slovakia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000157-0000-0000-0000-000000000001"), "Slovenia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000158-0000-0000-0000-000000000001"), "Solomon Islands", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000159-0000-0000-0000-000000000001"), "Somalia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000160-0000-0000-0000-000000000001"), "South Africa", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000161-0000-0000-0000-000000000001"), "South Korea", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000162-0000-0000-0000-000000000001"), "South Sudan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000163-0000-0000-0000-000000000001"), "Spain", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000164-0000-0000-0000-000000000001"), "Sri Lanka", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000165-0000-0000-0000-000000000001"), "Sudan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000166-0000-0000-0000-000000000001"), "Suriname", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000167-0000-0000-0000-000000000001"), "Sweden", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000168-0000-0000-0000-000000000001"), "Switzerland", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000169-0000-0000-0000-000000000001"), "Syria", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000170-0000-0000-0000-000000000001"), "Taiwan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000171-0000-0000-0000-000000000001"), "Tajikistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000172-0000-0000-0000-000000000001"), "Tanzania", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000173-0000-0000-0000-000000000001"), "Thailand", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000174-0000-0000-0000-000000000001"), "Timor-Leste", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000175-0000-0000-0000-000000000001"), "Togo", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000176-0000-0000-0000-000000000001"), "Tonga", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000177-0000-0000-0000-000000000001"), "Trinidad and Tobago", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000178-0000-0000-0000-000000000001"), "Tunisia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000179-0000-0000-0000-000000000001"), "Turkey", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000180-0000-0000-0000-000000000001"), "Turkmenistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000181-0000-0000-0000-000000000001"), "Tuvalu", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000182-0000-0000-0000-000000000001"), "Uganda", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000183-0000-0000-0000-000000000001"), "Ukraine", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000184-0000-0000-0000-000000000001"), "United Arab Emirates", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000185-0000-0000-0000-000000000001"), "United Kingdom", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000186-0000-0000-0000-000000000001"), "United States", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000187-0000-0000-0000-000000000001"), "Uruguay", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000188-0000-0000-0000-000000000001"), "Uzbekistan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000189-0000-0000-0000-000000000001"), "Vanuatu", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000190-0000-0000-0000-000000000001"), "Vatican City", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000191-0000-0000-0000-000000000001"), "Venezuela", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000192-0000-0000-0000-000000000001"), "Vietnam", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000193-0000-0000-0000-000000000001"), "Yemen", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000194-0000-0000-0000-000000000001"), "Zambia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("00000195-0000-0000-0000-000000000001"), "Zimbabwe", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Origins_Country_Locality",
                table: "Origins",
                columns: new[] { "Country", "Locality" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Origins_Country_Locality",
                table: "Origins");

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000002-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000002-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000003-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000003-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000004-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000004-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000005-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000005-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000006-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000006-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000007-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000007-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000008-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000008-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000009-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000009-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000010-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000010-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000011-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000011-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000012-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000012-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000013-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000013-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000014-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000014-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000015-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000015-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000016-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000016-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000017-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000017-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000018-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000018-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000019-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000019-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000020-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000020-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000021-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000021-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000022-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000022-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000023-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000023-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000024-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000024-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000025-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000025-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000026-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000026-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000027-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000027-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000028-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000028-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000029-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000029-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000030-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000030-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000031-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000031-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000032-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000032-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000033-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000033-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000034-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000034-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000035-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000035-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000036-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000036-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000037-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000037-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000038-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000038-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000039-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000039-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000040-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000040-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000041-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000041-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000042-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000042-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000043-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000043-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000044-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000044-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000045-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000045-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000046-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000046-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000047-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000047-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000048-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000048-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000049-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000049-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000050-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000050-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000051-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000051-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000052-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000052-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000053-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000053-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000054-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000054-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000055-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000055-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000056-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000056-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000057-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000057-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000058-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000058-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000059-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000059-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000060-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000060-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000061-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000061-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000062-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000062-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000063-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000063-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000064-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000064-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000065-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000066-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000067-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000068-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000069-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000070-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000071-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000072-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000073-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000074-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000075-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000076-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000077-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000078-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000079-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000080-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000081-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000082-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000083-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000084-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000085-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000086-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000087-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000088-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000089-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000090-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000091-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000092-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000093-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000094-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000095-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000096-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000097-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000098-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000099-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000100-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000101-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000102-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000103-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000104-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000105-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000106-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000107-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000108-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000109-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000110-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000111-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000112-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000113-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000114-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000115-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000116-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000117-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000118-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000119-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000120-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000121-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000122-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000123-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000124-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000125-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000126-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000127-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000128-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000129-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000130-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000131-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000132-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000133-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000134-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000135-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000136-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000137-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000138-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000139-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000140-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000141-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000142-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000143-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000144-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000145-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000146-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000147-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000148-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000149-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000150-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000151-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000152-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000153-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000154-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000155-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000156-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000157-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000158-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000159-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000160-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000161-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000162-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000163-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000164-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000165-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000166-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000167-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000168-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000169-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000170-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000171-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000172-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000173-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000174-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000175-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000176-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000177-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000178-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000179-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000180-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000181-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000182-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000183-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000184-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000185-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000186-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000187-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000188-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000189-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000190-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000191-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000192-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000193-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000194-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Origins",
                keyColumn: "Id",
                keyValue: new Guid("00000195-0000-0000-0000-000000000001"));

            migrationBuilder.RenameColumn(
                name: "Locality",
                table: "Origins",
                newName: "Region");

            migrationBuilder.AddColumn<string>(
                name: "Mine",
                table: "Origins",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }
    }
}
