namespace AstroHosting.Application.DTOs.User
{
    public class UserRegisterDto
    {
        public string UserName { get; set; } = null!;
        public string Login { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Bio { get; set; } = string.Empty;
    }
}
