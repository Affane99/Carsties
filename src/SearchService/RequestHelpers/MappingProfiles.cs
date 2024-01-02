using AutoMapper;
using Contracts;

namespace SearchService;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<AuctionCreated,Item>().ReverseMap();
        CreateMap<AuctionUpdated, Item>().ReverseMap();
        CreateMap<AuctionDeleted, Item>().ReverseMap();
    }
}
