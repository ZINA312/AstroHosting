namespace AstroHosting.API.ViewModels.User
{
    public class UserRegisterVm
    {
        public string UserName { get; set; } = null!;
        public string Login { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Bio { get; set; } = string.Empty;
    }
}
