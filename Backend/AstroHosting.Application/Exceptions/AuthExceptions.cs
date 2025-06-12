namespace AstroHosting.Application.Exceptions
{
    public class UserNotFoundException : Exception
    {
        public UserNotFoundException(string login)
            : base($"User with login '{login}' not found") { }
    }

    public class InvalidPasswordException : Exception
    {
        public InvalidPasswordException()
            : base("Invalid password") { }
    }

    public class InvalidTokenException : Exception
    {
        public InvalidTokenException(string message = "Invalid token")
            : base(message) { }
    }

    public class ExpiredRefreshTokenException : Exception
    {
        public ExpiredRefreshTokenException()
            : base("Refresh token has expired") { }
    }

    public class InvalidTokenConfigurationException : Exception
    {
        public InvalidTokenConfigurationException(string setting)
            : base($"Invalid token configuration: {setting}") { }
    }

    public class UserAlreadyExistsException : Exception
    {
        public UserAlreadyExistsException(string login)
            : base($"User with login '{login}' already exists") { }
    }
}
