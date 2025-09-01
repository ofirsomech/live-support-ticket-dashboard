using SupportDesk.Api.Entities;
using SupportDesk.Api.Data;

namespace SupportDesk.Api.Data;

public static class Seed
{
    public static void SeedData(AppDbContext db)
    {
        if (!db.Agents.Any())
        {
            db.Agents.AddRange(
                new Agent { Name = "Default Agent", Email = "agent@example.com" }
            );
            db.SaveChanges();
        }

        if (!db.Tickets.Any())
        {
            var agent = db.Agents.First();
            db.Tickets.AddRange(
                new Ticket { Title = "Can’t login", Description = "User reports invalid credentials.", Priority = TicketPriority.High, Status = TicketStatus.Open, AssignedAgentId = agent.Id },
                new Ticket { Title = "Payment failed", Description = "Stripe webhook error.", Priority = TicketPriority.Critical, Status = TicketStatus.InProgress, AssignedAgentId = agent.Id },
                new Ticket { Title = "Feature request: dark mode", Description = "Customer asks for dark theme.", Priority = TicketPriority.Low, Status = TicketStatus.Open }
            );
            db.SaveChanges();
        }
    }
}