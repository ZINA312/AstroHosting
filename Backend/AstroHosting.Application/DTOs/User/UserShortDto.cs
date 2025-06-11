namespace AstroHosting.Application.DTOs.User
{
    public class UserShortDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string AvatarUrl { get; set; } = null!;
    }
}
