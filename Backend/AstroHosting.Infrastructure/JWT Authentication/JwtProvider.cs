using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AstroHosting.Infrastructure.JWT_Authentication
{
    public class JwtProvider : IJwtProvider
    {
        private readonly IOptions<JwtOptions> _options;
        
        public JwtProvider(IOptions<JwtOptions> options)
        {
            _options = options;
        }

        public string GenerateToken(Guid userId)
        {
            var claims = new List<Claim>
            {
                new("userId", userId.ToString()),
            };

            var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Value.SecretKey)),
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _options.Value.Issuer,
                audience: _options.Value.Audience,
                claims: claims,
                signingCredentials: signingCredentials,
                expires: DateTime.Now.AddHours(_options.Value.AccessTokenExpirationHours));

            var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

            return tokenValue;
        }

        public string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }

        public ClaimsPrincipal? GetPrincipalFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = false,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _options.Value.Issuer,
                    ValidAudience = _options.Value.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Value.SecretKey))
                }, out _);

                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
