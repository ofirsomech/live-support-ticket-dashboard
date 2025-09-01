using SupportDesk.Api.Entities;
using FluentAssertions;
using Xunit;

namespace SupportDesk.Tests;

public class TicketTests
{
    [Fact]
    public void New_ticket_defaults_are_correct()
    {
        var t = new Ticket { Title = "Hello" };
        t.Status.Should().Be(TicketStatus.Open);
        t.Priority.Should().Be(TicketPriority.Medium);
        t.Id.Should().NotBe(Guid.Empty);
    }
}