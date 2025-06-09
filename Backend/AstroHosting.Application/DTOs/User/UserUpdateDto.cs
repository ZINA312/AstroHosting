namespace AstroHosting.Application.DTOs.User
{
    public class UserUpdateDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string AvatarUrl { get; set; } = null!;
        public string Bio { get; set; } = string.Empty;
    }
}
