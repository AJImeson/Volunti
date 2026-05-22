using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Volunti.Migrations
{
    /// <inheritdoc />
    public partial class AddJobLikesAndComments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "JobComments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JobId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ParentCommentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobComments_JobComments_ParentCommentId",
                        column: x => x.ParentCommentId,
                        principalTable: "JobComments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_JobComments_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "JobId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobComments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "JobLikes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JobId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobLikes_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "JobId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobLikes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobComments_JobId",
                table: "JobComments",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_JobComments_ParentCommentId",
                table: "JobComments",
                column: "ParentCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_JobComments_UserId",
                table: "JobComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_JobLikes_JobId_UserId",
                table: "JobLikes",
                columns: new[] { "JobId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobLikes_UserId",
                table: "JobLikes",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobComments");

            migrationBuilder.DropTable(
                name: "JobLikes");
        }
    }
}
