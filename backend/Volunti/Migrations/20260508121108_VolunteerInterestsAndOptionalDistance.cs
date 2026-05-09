using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Volunti.Migrations
{
    /// <inheritdoc />
    public partial class VolunteerInterestsAndOptionalDistance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "City",
                table: "Organizations",
                newName: "Muncipilaity");

            migrationBuilder.AlterColumn<int>(
                name: "MaxDistanceKm",
                table: "Volunteers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Categories",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactName",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "EmailNotifications",
                table: "Organizations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "NotificationPreference",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresDocumentation",
                table: "Organizations",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categories",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "ContactName",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "EmailNotifications",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "NotificationPreference",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "RequiresDocumentation",
                table: "Organizations");

            migrationBuilder.RenameColumn(
                name: "Muncipilaity",
                table: "Organizations",
                newName: "City");

            migrationBuilder.AlterColumn<int>(
                name: "MaxDistanceKm",
                table: "Volunteers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
