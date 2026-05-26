using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Volunti.Migrations
{
    /// <inheritdoc />
    public partial class AvailabilityMaxDistanceKm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Availability",
                table: "Volunteers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MaxDistanceKm",
                table: "Volunteers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Availability",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "MaxDistanceKm",
                table: "Volunteers");
        }
    }
}
