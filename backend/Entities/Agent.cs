using System.ComponentModel.DataAnnotations;

namespace SupportDesk.Api.Entities;

public class Agent
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Email { get; set; }
}