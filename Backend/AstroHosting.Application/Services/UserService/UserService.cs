using AstroHosting.Application.DTOs.User;
using AstroHosting.Application.Exceptions;
using AstroHosting.Core.Entities;
using AstroHosting.Infrastructure.Services;
using AstroHosting.Infrastructure.JWT_Authentication;
using AstroHosting.Infrastructure.Password_Hasher;
using AstroHosting.Persistence.Repositories.UserRepository;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;


namespace AstroHosting.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly ILogger<UserService> _logger;
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly IOptions<JwtOptions> _jwtOptions;
        private readonly IFileService _fileService; 

        public UserService(IMapper mapper, ILogger<UserService> logger, IUserRepository userRepository,
            IJwtProvider jwtProvider, IPasswordHasher passwordHasher, IOptions<JwtOptions> jwtOptions,
            IFileService fileService)
        {
            _mapper = mapper;
            _logger = logger;
            _userRepository = userRepository;
            _jwtProvider = jwtProvider;
            _passwordHasher = passwordHasher;
            _jwtOptions = jwtOptions;
            _fileService = fileService; 
        }

        public async Task<UserTokensDto> LoginAsync(UserAuthDto userAuthDto)
        {
            _logger.LogInformation("Login attempt for user: {Login}", userAuthDto.Login);

            var user = await _userRepository.GetByLoginAsync(userAuthDto.Login);
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
                userTokensDto.AccessToken.Length > 10 ? userTokensDto.AccessToken[..10] + "..." : userTokensDto.AccessToken);

            var principal = _jwtProvider.GetPrincipalFromToken(userTokensDto.AccessToken);
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

            var newJwtToken = _jwtProvider.GenerateToken(user.Id);
            var newRefreshToken = _jwtProvider.GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_jwtOptions.Value.RefreshTokenExpirationDays);

            await _userRepository.UpdateAsync(user);
            _logger.LogInformation("Tokens refreshed for user: {UserId}", userId);

            return new UserTokensDto
            {
                AccessToken = newJwtToken,
                RefreshToken = newRefreshToken,
            };
        }

        public async Task RegisterAsync(UserRegisterDto userRegisterDto)
        {
            _logger.LogInformation("Registration attempt for user: {Login}", userRegisterDto.Login);

            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(userRegisterDto.Login))
                errors.Add(nameof(userRegisterDto.Login), ["Login is required."]);
            else if (userRegisterDto.Login.Length > 50)
                errors.Add(nameof(userRegisterDto.Login), ["Login cannot exceed 50 characters."]);

            if (string.IsNullOrWhiteSpace(userRegisterDto.Password))
            {
                errors.Add(nameof(userRegisterDto.Password), ["Password is required."]);
            }
            else
            {
                if (userRegisterDto.Password.Length < 8) 
                {
                    errors.Add(nameof(userRegisterDto.Password), ["Password must be at least 8 characters long."]);
                }
                if (!Regex.IsMatch(userRegisterDto.Password, "[A-Z]"))
                {
                    errors.Add(nameof(userRegisterDto.Password), ["Password must contain at least one uppercase letter."]);
                }
                if (!Regex.IsMatch(userRegisterDto.Password, "[a-z]"))
                {
                    errors.Add(nameof(userRegisterDto.Password), ["Password must contain at least one lowercase letter."]);
                }
                if (!Regex.IsMatch(userRegisterDto.Password, "[0-9]"))
                {
                    errors.Add(nameof(userRegisterDto.Password), ["Password must contain at least one digit."]);
                }
                if (!Regex.IsMatch(userRegisterDto.Password, "[^a-zA-Z0-9]")) 
                {
                    errors.Add(nameof(userRegisterDto.Password), ["Password must contain at least one special character."]);
                }
            }

            if (string.IsNullOrWhiteSpace(userRegisterDto.UserName))
                errors.Add(nameof(userRegisterDto.UserName), ["Username is required."]);
            else if (userRegisterDto.UserName.Length > 50)
                errors.Add(nameof(userRegisterDto.UserName), ["Username cannot exceed 50 characters."]);

            if (userRegisterDto.Bio != null && userRegisterDto.Bio.Length > 500)
                errors.Add(nameof(userRegisterDto.Bio), ["Bio cannot exceed 500 characters."]);

            var existingUser = await _userRepository.GetByLoginAsync(userRegisterDto.Login);
            if (existingUser != null)
            {
                errors.Add(nameof(userRegisterDto.Login), [$"User with login '{userRegisterDto.Login}' already exists."]);
            }

            if (errors.Count != 0)
            {
                _logger.LogWarning("Registration failed due to validation errors for user: {Login}. Errors: {Errors}",
                    userRegisterDto.Login,
                    string.Join("; ", errors.SelectMany(e => e.Value)));
                throw new ValidationException("Registration validation failed.", errors);
            }

            var hashedPassword = _passwordHasher.Generate(userRegisterDto.Password);
            var user = _mapper.Map<User>(userRegisterDto);
            user.PasswordHash = hashedPassword;
            user.AvatarUrl = "/uploads/users/default.svg";
            user.DateCreated = DateTime.UtcNow;
            user.DateUpdated = DateTime.UtcNow;

            await _userRepository.AddAsync(user);
            _logger.LogInformation("User registered: {UserId}", user.Id);
        }

        public async Task<UserProfileDto> GetUserProfileAsync(Guid userId)
        {
            _logger.LogInformation("Retrieving user profile for ID: {UserId}", userId);
            var user = await _userRepository.GetUserProfileByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found when retrieving profile.", userId);
                throw new UserNotFoundException(userId.ToString());
            }
            return _mapper.Map<UserProfileDto>(user);
        }

        public async Task UpdateUserProfileAsync(UserUpdateDto updateDto)
        {
            _logger.LogInformation("Attempting to update user profile for ID: {UserId}", updateDto.Id);

            var user = await _userRepository.GetByIdAsync(updateDto.Id);
            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found for profile update.", updateDto.Id);
                throw new UserNotFoundException(updateDto.Id.ToString());
            }

            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(updateDto.Username))
                errors.Add(nameof(updateDto.Username), ["Username is required."]);
            else if (updateDto.Username.Length > 50)
                errors.Add(nameof(updateDto.Username), ["Username cannot exceed 50 characters."]);

            if (updateDto.Bio != null && updateDto.Bio.Length > 500)
                errors.Add(nameof(updateDto.Bio), ["Bio cannot exceed 500 characters."]);

            if (updateDto.NewAvatarFileStream != null && !string.IsNullOrWhiteSpace(updateDto.NewAvatarFileName))
            {
                if (updateDto.NewAvatarFileStream.Length == 0)
                {
                    errors.Add(nameof(updateDto.NewAvatarFileStream), ["New avatar file cannot be empty."]);
                }
            }

            if (errors.Count != 0)
            {
                _logger.LogWarning("User profile update failed due to validation errors for User {UserId}. Errors: {Errors}",
                    updateDto.Id, 
                    string.Join("; ", errors.SelectMany(e => e.Value)));
                throw new ValidationException("User profile validation failed.", errors);
            }

            if (updateDto.NewAvatarFileStream != null && !string.IsNullOrWhiteSpace(updateDto.NewAvatarFileName))
            {
                if (!string.IsNullOrEmpty(user.AvatarUrl) && user.AvatarUrl != "/uploads/users/default.svg")
                {
                    _fileService.DeleteFile(user.AvatarUrl);
                    _logger.LogInformation("Old avatar file {AvatarUrl} deleted for user {UserId}.", user.AvatarUrl, user.Id);
                }

                var newAvatarUrl = await _fileService.SaveFileAsync(updateDto.NewAvatarFileStream, 
                    updateDto.NewAvatarFileName,
                    "uploads/users");
                user.AvatarUrl = newAvatarUrl;
            }

            _mapper.Map(updateDto, user);
            user.DateUpdated = DateTime.UtcNow; 

            await _userRepository.UpdateAsync(user);
            _logger.LogInformation("User profile {UserId} successfully updated.", user.Id);
        }

        public async Task DeleteUserAsync(UserDeleteDto deleteDto)
        {
            _logger.LogWarning("Attempting to PERMANENTLY delete user account {UserId}. This action is irreversible.",
                deleteDto.UserId);

            var user = await _userRepository.GetByIdAsync(deleteDto.UserId);
            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found for deletion.", deleteDto.UserId);
                throw new UserNotFoundException(deleteDto.UserId.ToString());
            }

            if (!string.IsNullOrEmpty(user.AvatarUrl) && user.AvatarUrl != "/uploads/users/default.svg")
            {
                _fileService.DeleteFile(user.AvatarUrl);
                _logger.LogInformation("Avatar file {AvatarUrl} deleted for user {UserId}.", user.AvatarUrl, user.Id);
            }

            await _userRepository.DeleteAsync(user);
            _logger.LogInformation("User account {UserId} permanently deleted.", user.Id);
        }
    }
}
