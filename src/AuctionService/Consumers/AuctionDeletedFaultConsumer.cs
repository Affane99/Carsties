using Contracts;
using MassTransit;

namespace AuctionService;

public class AuctionDeletedFaultConsumer : IConsumer<Fault<AuctionDeleted>>
{
    public Task Consume(ConsumeContext<Fault<AuctionDeleted>> context)
    {
        throw new NotImplementedException();
    }
}
