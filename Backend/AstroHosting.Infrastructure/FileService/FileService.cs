using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;

namespace AstroHosting.Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<FileService> _logger;

        public FileService(IWebHostEnvironment env, ILogger<FileService> logger)
        {
            _env = env;
            _logger = logger;
        }

        public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string subfolder)
        {
            if (fileStream == null || fileStream.Length == 0)
            {
                throw new ArgumentException("File stream cannot be empty.", nameof(fileStream));
            }
            if (string.IsNullOrWhiteSpace(fileName))
            {
                throw new ArgumentException("File name cannot be empty.", nameof(fileName));
            }
            if (string.IsNullOrWhiteSpace(subfolder))
            {
                throw new ArgumentException("Subfolder cannot be empty.", nameof(subfolder));
            }

            try
            {
                subfolder = subfolder.TrimStart('/').TrimEnd('/');

                var uploadPath = Path.Combine(_env.WebRootPath, subfolder);

                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                var fileExtension = Path.GetExtension(fileName).ToLowerInvariant();
                var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                var fullFilePath = Path.Combine(uploadPath, uniqueFileName);

                _logger.LogInformation("Saving file to: {FullFilePath}", fullFilePath);

                using (var output = new FileStream(fullFilePath, FileMode.Create))
                {
                    await fileStream.CopyToAsync(output);
                }

                var relativeUrl = $"/{subfolder}/{uniqueFileName}".Replace("\\", "/");
                _logger.LogInformation("File saved. Relative URL: {RelativeUrl}", relativeUrl);
                return relativeUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving file {FileName} to subfolder {Subfolder}", fileName, subfolder);
                throw new InvalidOperationException($"Could not save file {fileName}.", ex);
            }
        }

        public void DeleteFile(string fileUrl)
        {
            if (string.IsNullOrWhiteSpace(fileUrl))
            {
                _logger.LogWarning("Attempted to delete file with empty URL.");
                return;
            }

            try
            {
                var relativePath = fileUrl.TrimStart('/');
                var fullFilePath = Path.Combine(_env.WebRootPath, relativePath);

                _logger.LogInformation("Attempting to delete file from: {FullFilePath}", fullFilePath);

                if (File.Exists(fullFilePath))
                {
                    File.Delete(fullFilePath);
                    _logger.LogInformation("File successfully deleted: {FullFilePath}", fullFilePath);
                }
                else
                {
                    _logger.LogWarning("File not found for deletion: {FullFilePath}", fullFilePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file {FileUrl}", fileUrl);
            }
        }
    }
}