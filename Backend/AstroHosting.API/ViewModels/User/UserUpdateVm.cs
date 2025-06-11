namespace AstroHosting.API.ViewModels.User
{
    public class UserUpdateVm
    {
        public string Username { get; set; } = null!;
        public string AvatarUrl { get; set; } = null!;
        public string Bio { get; set; } = string.Empty;
    }
}
