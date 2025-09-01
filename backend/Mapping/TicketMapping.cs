using SupportDesk.Api.DTOs;
using SupportDesk.Api.Entities;

namespace SupportDesk.Api.Mapping;

public static class TicketMapping
{
    public static TicketDto ToDto(this Ticket t) =>
        new TicketDto(t.Id, t.Title, t.Description, t.Priority, t.Status, t.AssignedAgentId, t.CreatedAt, t.UpdatedAt);
}