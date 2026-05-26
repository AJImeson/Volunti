using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Volunti.Migrations
{
    /// <inheritdoc />
    public partial class AddOrgProfileFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Activities",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Areas",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ContactPersonAddedAt",
                table: "Organizations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPersonEmail",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPersonName",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPersonPhone",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Requirements",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TargetGroup",
                table: "Organizations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "VerifiedAt",
                table: "Organizations",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Activities",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "Areas",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "Bio",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "ContactPersonAddedAt",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "ContactPersonEmail",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "ContactPersonName",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "ContactPersonPhone",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "Requirements",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "TargetGroup",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "VerifiedAt",
                table: "Organizations");
        }
    }
}
