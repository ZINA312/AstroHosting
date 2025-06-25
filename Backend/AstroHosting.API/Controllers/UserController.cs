using AstroHosting.API.ViewModels.User;
using AstroHosting.Application.DTOs.User;
using AstroHosting.Application.Exceptions;
using AstroHosting.Application.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AstroHosting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, IMapper mapper,
            ILogger<UserController> logger)
        {
            _userService = userService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserAuthVm authVm) 
        {
            try
            {
                var authDto = _mapper.Map<UserAuthDto>(authVm);
                var tokens = await _userService.LoginAsync(authDto);
                Response.Cookies.Append("access_token", tokens.AccessToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                });
                Response.Cookies.Append("refresh_token", tokens.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, 
                    SameSite = SameSiteMode.Strict,
                });
                return Ok(new { message = "Login successful" });
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogWarning(ex, "Login failed: {Message}", ex.Message);
                return Unauthorized(new { error = "Invalid login credentials" });
            }
            catch (InvalidPasswordException ex)
            {
                _logger.LogWarning(ex, "Login failed: {Message}", ex.Message);
                return Unauthorized(new { error = "Invalid login credentials" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for user: {Login}", authVm.Login);
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserRegisterVm registerVm) 
        {
            try
            {
                var registerDto = _mapper.Map<UserRegisterDto>(registerVm);
                await _userService.RegisterAsync(registerDto);
                return Ok(new { message = "User registered successfully" });
            }
            catch (UserAlreadyExistsException ex)
            {
                _logger.LogWarning(ex, "Registration failed: {Message}", ex.Message);
                return Conflict(new { error = ex.Message });
            }
            catch (ValidationException ex) 
            {
                _logger.LogWarning(ex, "Validation error during registration: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message, errors = ex.Errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for user: {Login}", registerVm.Login);
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpPost("refresh")]
        [Authorize]
        public async Task<IActionResult> RefreshTokens()
        {
            try
            {
                if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken) || string.IsNullOrEmpty(refreshToken))
                {
                    _logger.LogWarning("Refresh token not found in cookie");
                    return Unauthorized(new { error = "Refresh token not provided" });
                }
                var authHeader = Request.Headers.Authorization.ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogWarning("Access token not found or invalid in Authorization header");
                    return Unauthorized(new { error = "Access token not provided" });
                }

                var accessToken = authHeader["Bearer ".Length..].Trim();
                var tokensDto = new UserTokensDto
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };
                var newTokens = await _userService.RefreshTokensAsync(tokensDto);
                Response.Cookies.Append("access_token", newTokens.AccessToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(15)
                });
                Response.Cookies.Append("refresh_token", newTokens.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(7)
                });
                return Ok(new { message = "Refresh successful" });
            }
            catch (InvalidTokenException ex)
            {
                _logger.LogWarning(ex, "Token refresh failed: {Message}", ex.Message);
                return Unauthorized(new { error = "Invalid token" });
            }
            catch (ExpiredRefreshTokenException ex)
            {
                _logger.LogWarning(ex, "Token refresh failed: {Message}", ex.Message);
                return Unauthorized(new { error = "Refresh token expired" });
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogWarning(ex, "Token refresh failed: {Message}", ex.Message);
                return Unauthorized(new { error = "Invalid token" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserProfile(Guid id)
        {
            try
            {
                _logger.LogInformation("Attempting to retrieve user profile for ID: {UserId}", id);
                var userProfileDto = await _userService.GetUserProfileAsync(id);
                var userProfileVm = _mapper.Map<UserProfileVm>(userProfileDto);
                _logger.LogInformation("Successfully retrieved user profile for ID: {UserId}", id);
                return Ok(userProfileVm);
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to retrieve user profile: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving user profile for ID: {UserId}", id);
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpPut("my-profile")]
        [Authorize]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateUserProfile([FromForm] UserUpdateVm updateVm)
        {
            try
            {
                var userId = GetCurrentUserId(); 
                _logger.LogInformation("Attempting to update user profile for ID: {UserId}", userId);

                var updateDto = _mapper.Map<UserUpdateDto>(updateVm);
                updateDto.Id = userId;

                if (updateVm.NewAvatarFile != null)
                {
                    updateDto.NewAvatarFileStream = updateVm.NewAvatarFile.OpenReadStream();
                    updateDto.NewAvatarFileName = updateVm.NewAvatarFile.FileName;
                }

                await _userService.UpdateUserProfileAsync(updateDto);
                _logger.LogInformation("User profile {UserId} successfully updated.", userId);
                return NoContent(); 
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to update user profile: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation error during user profile update: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message, errors = ex.Errors });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during user profile update: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while updating user profile.");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpDelete("my-account")]
        [Authorize]
        public async Task<IActionResult> DeleteMyAccount()
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogWarning("Attempting to PERMANENTLY delete user account {UserId}. This action is irreversible.", userId);

                var deleteDto = new UserDeleteDto { UserId = userId };
                await _userService.DeleteUserAsync(deleteDto);
                _logger.LogInformation("User account {UserId} successfully deleted.", userId);

                Response.Cookies.Delete("access_token");
                Response.Cookies.Delete("refresh_token");

                return NoContent(); 
            }
            catch (UserNotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to delete user account: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during user account deletion: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while deleting user account.");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId" || c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }
            _logger.LogError("User ID claim not found or is invalid in the token.");
            throw new InvalidOperationException("User ID not found in token. Authentication required.");
        }
    }
}
