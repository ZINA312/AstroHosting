namespace AstroHosting.Infrastructure.Services
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(Stream fileStream, string fileName, string subfolder);
        void DeleteFile(string fileUrl);
    }
}
