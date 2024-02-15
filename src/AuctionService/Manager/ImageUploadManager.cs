
namespace AuctionService;

public class ImageUploadManager : IImageUploadManager
{
    public ImageUploadManager()
    {

    }
    public string GetFileExtension(string contentType)
    {
        int indexLastPoint = contentType.LastIndexOf('.');
        if (indexLastPoint < 0)
            return "";
        string Substring = contentType.Substring(indexLastPoint);
        return Substring.ToLower();
    }

    public async Task<string> UploadImageAsync(Stream imageStream, string id, string extention)
    {
        var imageDirectoryPath = Path.GetFullPath("images");

        var fileName = $"{id}{extention}";

        var searchPattern = $"{id}.*";
        var filesInDirectory = Directory.GetFiles(imageDirectoryPath, searchPattern);

        foreach (var fileP in filesInDirectory)
        {
            File.Delete(fileP);
        }

        var filePath = Path.Combine(imageDirectoryPath, fileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await imageStream.CopyToAsync(fileStream);
        }

        return $"http://localhost:7001/images/{fileName}";
    }
}
