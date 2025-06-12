namespace AstroHosting.Infrastructure.JWT_Authentication
{
   public class JwtOptions
   {
        public string SecretKey { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public int AccessTokenExpirationHours { get; set; }
        public int RefreshTokenExpirationDays { get; set; }
    }
}
