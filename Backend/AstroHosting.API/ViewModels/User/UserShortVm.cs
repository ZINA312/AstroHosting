namespace AstroHosting.API.ViewModels.User
{
    public class UserShortVm
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string AvatarUrl { get; set; } = null!;
    }
}
