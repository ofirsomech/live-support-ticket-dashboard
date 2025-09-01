using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupportDesk.Api.Entities;

public enum TicketStatus { Open = 0, InProgress = 1, Resolved = 2 }
public enum TicketPriority { Low = 0, Medium = 1, High = 2, Critical = 3 }

public class Ticket
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(140)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? Description { get; set; }

    [Required]
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;

    [Required]
    public TicketStatus Status { get; set; } = TicketStatus.Open;

    public Guid? AssignedAgentId { get; set; }

    [ForeignKey(nameof(AssignedAgentId))]
    public Agent? AssignedAgent { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}