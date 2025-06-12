using AstroHosting.API.ViewModels.User;
using AstroHosting.Application.DTOs.User;
using AstroHosting.Application.Exceptions;
using AstroHosting.Application.Services.UserService;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AstroHosting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService,IMapper mapper,
            ILogger<UserController> logger)
        {
            _userService = userService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserAuthVm authVm)
        {
            try
            {
                var authDto = _mapper.Map<UserAuthDto>(authVm);
                var tokens = await _userService.LoginAsync(authDto);
                Response.Cookies.Append("access_token", tokens.AccessToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
                });
                Response.Cookies.Append("refresh_token", tokens.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
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
        public async Task<IActionResult> Register(UserRegisterVm registerVm)
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
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid registration data: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message });
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
                var authHeader = Request.Headers["Authorization"].ToString();
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
                    SameSite = SameSiteMode.Strict
                });
                Response.Cookies.Append("refresh_token", newTokens.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
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

    }
}
