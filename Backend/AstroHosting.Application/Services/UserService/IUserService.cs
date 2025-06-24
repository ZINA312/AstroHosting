using AstroHosting.Application.DTOs.User;

namespace AstroHosting.Application.Services
{
    public interface IUserService
    {
        public Task RegisterAsync(UserRegisterDto userRegisterDto);
        public Task<UserTokensDto> LoginAsync(UserAuthDto userAuthDto);
        public Task<UserTokensDto> RefreshTokensAsync(UserTokensDto userTokensDto);
        Task<UserProfileDto> GetUserProfileAsync(Guid userId);
        Task UpdateUserProfileAsync(UserUpdateDto updateDto);
        Task DeleteUserAsync(UserDeleteDto deleteDto);
    }
}
