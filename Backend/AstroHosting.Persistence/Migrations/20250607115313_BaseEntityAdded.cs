using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AstroHosting.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class BaseEntityAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RegistrationDate",
                table: "Users",
                newName: "DateUpdated");

            migrationBuilder.RenameColumn(
                name: "SubscriptionDate",
                table: "Subscriptions",
                newName: "DateUpdated");

            migrationBuilder.RenameColumn(
                name: "UploadDate",
                table: "Posts",
                newName: "DateUpdated");

            migrationBuilder.RenameColumn(
                name: "LikeDate",
                table: "Likes",
                newName: "DateUpdated");

            migrationBuilder.RenameColumn(
                name: "CommentDate",
                table: "Comments",
                newName: "DateUpdated");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Subscriptions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Subscriptions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Posts",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Posts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Likes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Likes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Equipment",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Equipment",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateUpdated",
                table: "Equipment",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Comments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Comments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Equipment");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Equipment");

            migrationBuilder.DropColumn(
                name: "DateUpdated",
                table: "Equipment");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "DateUpdated",
                table: "Users",
                newName: "RegistrationDate");

            migrationBuilder.RenameColumn(
                name: "DateUpdated",
                table: "Subscriptions",
                newName: "SubscriptionDate");

            migrationBuilder.RenameColumn(
                name: "DateUpdated",
                table: "Posts",
                newName: "UploadDate");

            migrationBuilder.RenameColumn(
                name: "DateUpdated",
                table: "Likes",
                newName: "LikeDate");

            migrationBuilder.RenameColumn(
                name: "DateUpdated",
                table: "Comments",
                newName: "CommentDate");
        }
    }
}
