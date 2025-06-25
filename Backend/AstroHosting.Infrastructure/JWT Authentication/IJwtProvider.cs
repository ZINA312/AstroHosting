using System.Security.Claims;

namespace AstroHosting.Infrastructure.JWT_Authentication
{
    public interface IJwtProvider
    {
        string GenerateToken(Guid userId);
        string GenerateRefreshToken();
        public ClaimsPrincipal? GetPrincipalFromToken(string token);
    }
}