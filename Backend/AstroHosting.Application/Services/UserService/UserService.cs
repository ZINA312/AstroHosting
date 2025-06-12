using AstroHosting.Application.DTOs.User;
using AstroHosting.Application.Exceptions;
using AstroHosting.Core.Entities;
using AstroHosting.Infrastructure.JWT_Authentication;
using AstroHosting.Infrastructure.Password_Hasher;
using AstroHosting.Persistence.Repositories.UserRepository;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AstroHosting.Application.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly ILogger<UserService> _logger;
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly IOptions<JwtOptions> _jwtOptions;

        public UserService(IMapper mapper, ILogger<UserService> logger, IUserRepository userRepository, 
            IJwtProvider jwtProvider, IPasswordHasher passwordHasher, IOptions<JwtOptions> jwtOptions)
        {
            _mapper = mapper;
            _logger = logger;
            _userRepository = userRepository;
            _jwtProvider = jwtProvider;
            _passwordHasher = passwordHasher;
            _jwtOptions = jwtOptions;
        }

        public async Task<UserTokensDto> LoginAsync(UserAuthDto userAuthDto)
        {
            _logger.LogInformation("Login attempt for user: {Login}", userAuthDto.Login);

            var user = await _userRepository.GetByLoginAsync(userAuthDto.Login) ?? throw new Exception("User not found");
            if (user == null)
            {
                _logger.LogWarning("User not found: {Login}", userAuthDto.Login);
                throw new UserNotFoundException(userAuthDto.Login);
            }

            var isVerifySuccessfull = _passwordHasher.Verify(userAuthDto.Password, user.PasswordHash);
            if (!isVerifySuccessfull)
            {
                _logger.LogWarning("Invalid password for user: {UserId}", user.Id);
                throw new InvalidPasswordException();
            }

            var jwtToken = _jwtProvider.GenerateToken(user.Id);

            var refreshTokenExpiresDays = _jwtOptions.Value.RefreshTokenExpirationDays;
            if (refreshTokenExpiresDays <= 0)
            {
                _logger.LogError("Invalid refresh token expiration configuration: {Days}",
                    _jwtOptions.Value.RefreshTokenExpirationDays);
                throw new InvalidTokenConfigurationException("RefreshTokenExpirationDays must be positive");
            }
            var refreshToken = _jwtProvider.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(refreshTokenExpiresDays);

            await _userRepository.UpdateAsync(user);
            _logger.LogInformation("User logged in: {UserId}", user.Id);

            return new UserTokensDto
            {
                AccessToken = jwtToken,
                RefreshToken = refreshToken,
            };
        }

        public async Task<UserTokensDto> RefreshTokensAsync(UserTokensDto userTokensDto)
        {
            _logger.LogInformation("Refreshing tokens for access token: {Token}",
                userTokensDto.AccessToken[..10] + "...");

            var principal = _jwtProvider.GetPrincipalFromToken(userTokensDto.AccessToken) 
                ?? throw new Exception("Invalid access token!");
            if (principal == null)
            {
                _logger.LogWarning("Invalid access token during refresh");
                throw new InvalidTokenException();
            }

            var userIdClaim = principal.FindFirst("userId");
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                _logger.LogWarning("Missing or invalid userId claim in token");
                throw new InvalidTokenException("Missing userId claim");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User not found during token refresh: {UserId}", userId);
                throw new UserNotFoundException(userId.ToString());
            }

            if (user.RefreshToken != userTokensDto.RefreshToken)
            {
                _logger.LogWarning("Refresh token mismatch for user: {UserId}", userId);
                throw new InvalidTokenException("Refresh token mismatch");
            }
            if (user.RefreshTokenExpiry < DateTime.UtcNow)
            {
                _logger.LogWarning("Expired refresh token for user: {UserId}", userId);
                throw new ExpiredRefreshTokenException();
            }

            if (_jwtOptions.Value.RefreshTokenExpirationDays <= 0)
            {
                _logger.LogError("Invalid refresh token expiration configuration: {Days}",
                    _jwtOptions.Value.RefreshTokenExpirationDays);
                throw new InvalidTokenConfigurationException("RefreshTokenExpirationDays must be positive");
            }

            var newjwtToken = _jwtProvider.GenerateToken(user.Id);
            var newRefreshToken = _jwtProvider.GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_jwtOptions.Value.RefreshTokenExpirationDays);

            await _userRepository.UpdateAsync(user);
            _logger.LogInformation("Tokens refreshed for user: {UserId}", userId);

            return new UserTokensDto
            {
                AccessToken = newjwtToken,
                RefreshToken = newRefreshToken,
            };
        }

        public async Task RegisterAsync(UserRegisterDto userRegisterDto)
        {
            _logger.LogInformation("Registration attempt for user: {Login}", userRegisterDto.Login);

            if (string.IsNullOrWhiteSpace(userRegisterDto.Login))
                throw new ArgumentException("Login is required", nameof(userRegisterDto.Login));

            if (string.IsNullOrWhiteSpace(userRegisterDto.Password))
                throw new ArgumentException("Password is required", nameof(userRegisterDto.Password));

            if (string.IsNullOrWhiteSpace(userRegisterDto.UserName))
                throw new ArgumentException("Username is required", nameof(userRegisterDto.UserName));

            var existingUser = await _userRepository.GetByLoginAsync(userRegisterDto.Login);
            if (existingUser != null)
            {
                _logger.LogWarning("User already exists: {Login}", userRegisterDto.Login);
                throw new UserAlreadyExistsException(userRegisterDto.Login);
            }

            var hashedPassword = _passwordHasher.Generate(userRegisterDto.Password);
            var user = new User();

            _mapper.Map(userRegisterDto, user);
            user.PasswordHash = hashedPassword;
            user.AvatarUrl = "/uploads/users/default.svg";

            await _userRepository.AddAsync(user);
            _logger.LogInformation("User registered: {UserId}", user.Id);
        }
    }
}
