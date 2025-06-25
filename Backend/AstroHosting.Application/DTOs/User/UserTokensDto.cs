namespace AstroHosting.Application.DTOs.User
{
    public class UserTokensDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken {  get; set; } = string.Empty;
    }
}
