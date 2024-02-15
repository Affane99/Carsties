using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IImageUploadManager _imageUploadManager;
    private static readonly string[] ImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".tif", ".webp", ".svg", ".ico", };

    public AuctionsController(
        AuctionDbContext context,
        IMapper mapper,
        IPublishEndpoint publishEndpoint,
        IImageUploadManager imageUploadManager
    )
    {
        _context = context;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
        _imageUploadManager = imageUploadManager;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(string date)
    {
        var query = _context.Auctions.OrderBy(x => x.Item.Make).AsQueryable();

        if (!string.IsNullOrEmpty(date))
        {
            query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
        }

        return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        var auction = await _context.Auctions
        .Include(x => x.Item)
        .FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null) return NotFound();

        return _mapper.Map<AuctionDto>(auction);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto createAuctionDto)
    {
        var auction = _mapper.Map<Auction>(createAuctionDto);

        auction.Seller = User.Identity.Name;

        _context.Auctions.Add(auction);

        var newAuction = _mapper.Map<AuctionDto>(auction);

        await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Could not save changes to the DB");

        return CreatedAtAction(nameof(GetAuctionById), new { auction.Id }, _mapper.Map<AuctionDto>(auction));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto auctionDto)
    {
        var auction = await _context.Auctions.Include(x => x.Item)
        .FirstOrDefaultAsync(x => x.Id.Equals(id));

        if (auction.Seller != User.Identity.Name) return Forbid();

        auction.Item.Make = auctionDto.Make ?? auction.Item.Make;
        auction.Item.Model = auctionDto.Model ?? auction.Item.Model;
        auction.Item.Color = auctionDto.Color ?? auction.Item.Color;
        auction.Item.Mileage = auctionDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = auctionDto.Year ?? auction.Item.Year;

        try
        {
            await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));
        }
        catch (System.Exception e)
        {
            Console.WriteLine("error " + e);
        }

        var result = await _context.SaveChangesAsync() > 0;

        if (result) return Ok();

        return BadRequest("Probleme saving changes");
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await _context.Auctions.FindAsync(id);

        if (auction == null) return NotFound();

        if (auction.Seller != User.Identity.Name) return Forbid();

        _context.Auctions.Remove(auction);

        await _publishEndpoint.Publish(new AuctionDeleted { Id = auction.Id.ToString() });

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Could not update DB");

        return Ok();
    }

    [Authorize]
    [HttpPost("upload")]
    public async Task<ActionResult> UploadImage()
    {
        var file = Request.Form.Files[0];
        var seller = User.Identity.Name;

        if (file == null || file.Length == 0)
        {
            return BadRequest("Aucun fichier n'a été envoyé.");
        }

        var extention = _imageUploadManager.GetFileExtension(file.FileName);

        if (!ImageExtensions.Contains(extention))
            return BadRequest("Choisir un fichier image valide");

        if (!Request.Form.TryGetValue("id", out var id) || !Guid.TryParse(id, out var auctionId))
        {
            return BadRequest("The auction id is required");
        }


        var auction = await _context.Auctions.Include(x => x.Item).FirstAsync(x => x.Id == auctionId);

        if (auction == null)
            return NotFound("the auction was not found");

        if (auction.Seller != seller)
            return Forbid();

        var imageUrl = await _imageUploadManager.UploadImageAsync(file.OpenReadStream(), id, extention);

        auction.Item.ImageUrl = imageUrl;
        auction.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));
        }
        catch (System.Exception e)
        {
            Console.BackgroundColor = ConsoleColor.Red;
            Console.WriteLine("error " + e);
            Console.BackgroundColor = ConsoleColor.Blue;
        }

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Error occured");

        return Ok(new { imageUrl });
    }
}
