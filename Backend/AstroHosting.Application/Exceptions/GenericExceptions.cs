namespace AstroHosting.Application.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string entityName, object key)
            : base($"Entity \"{entityName}\" with key ({key}) not found.") { }
    }

    public class ForbiddenException : Exception
    {
        public ForbiddenException() 
            : base("You do not have the rights to perform this action.") { }
    }

    public class ValidationException : Exception
    {
        public IDictionary<string, string[]> Errors { get; }

        public ValidationException(string entityName, object key)
            : base($"Entity  \"{entityName}\" with key ({key}) failed validation.") { }

        public ValidationException(string message, IDictionary<string, string[]> errors)
            : base(message)
        {
            Errors = errors ?? new Dictionary<string, string[]>();
        }

        public ValidationException(string message) : base(message)
        {
            Errors = new Dictionary<string, string[]>();
        }
    }
}