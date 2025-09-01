using SupportDesk.Api.Entities;

namespace SupportDesk.Api.DTOs;

public record TicketDto(
    Guid Id,
    string Title,
    string? Description,
    TicketPriority Priority,
    TicketStatus Status,
    Guid? AssignedAgentId,
    DateTime CreatedAt,
    DateTime UpdatedAt
);