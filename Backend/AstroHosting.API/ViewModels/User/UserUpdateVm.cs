namespace AstroHosting.API.ViewModels.User
{
    public class UserUpdateVm
    {
        public string Username { get; set; } = null!;
        public IFormFile? NewAvatarFile { get; set; }
        public string Bio { get; set; } = string.Empty;
    }
}
