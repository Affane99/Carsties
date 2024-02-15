namespace AuctionService;

public interface IImageUploadManager
{
    public Task<string> UploadImageAsync(Stream imageStream, string id, string extention);
    public string GetFileExtension(string contentType);
}
