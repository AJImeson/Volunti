using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Volunti.Migrations
{
    /// <inheritdoc />
    public partial class RemovedRoleId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Volunteers_UserId",
                table: "Volunteers");

            migrationBuilder.DropIndex(
                name: "IX_Organizations_UserId",
                table: "Organizations");

            migrationBuilder.AlterColumn<int>(
                name: "RoleId",
                table: "Volunteers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "RoleId",
                table: "Organizations",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Volunteers_UserId",
                table: "Volunteers",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Organizations_UserId",
                table: "Organizations",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Volunteers_UserId",
                table: "Volunteers");

            migrationBuilder.DropIndex(
                name: "IX_Organizations_UserId",
                table: "Organizations");

            migrationBuilder.AlterColumn<int>(
                name: "RoleId",
                table: "Volunteers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "RoleId",
                table: "Organizations",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Volunteers_UserId",
                table: "Volunteers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Organizations_UserId",
                table: "Organizations",
                column: "UserId");
        }
    }
}
