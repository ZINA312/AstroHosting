using AstroHosting.Application.DTOs.User;

namespace AstroHosting.Application.Services.UserService
{
    public interface IUserService
    {
        public Task RegisterAsync(UserRegisterDto userRegisterDto);
        public Task<UserTokensDto> LoginAsync(UserAuthDto userAuthDto);
        public Task<UserTokensDto> RefreshTokensAsync(UserTokensDto userTokensDto);
    }
}
