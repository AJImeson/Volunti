using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Volunti.Migrations
{
    /// <inheritdoc />
    public partial class RenameMuncipilaityToMunicipality : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Muncipilaity",
                table: "Volunteers",
                newName: "Municipality");

            migrationBuilder.RenameColumn(
                name: "Muncipilaity",
                table: "Organizations",
                newName: "Municipality");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Municipality",
                table: "Volunteers",
                newName: "Muncipilaity");

            migrationBuilder.RenameColumn(
                name: "Municipality",
                table: "Organizations",
                newName: "Muncipilaity");
        }
    }
}
