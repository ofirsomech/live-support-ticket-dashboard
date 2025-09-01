using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using SupportDesk.Api.Data;
using SupportDesk.Api.DTOs;
using SupportDesk.Api.Entities;
using SupportDesk.Api.Mapping;
using SupportDesk.Api.Hubs;

namespace SupportDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHubContext<TicketsHub> _hub;

    public TicketsController(AppDbContext db, IHubContext<TicketsHub> hub)
    {
        _db = db;
        _hub = hub;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketDto>>> List([FromQuery] TicketStatus? status, [FromQuery] TicketPriority? priority, [FromQuery] string? search, [FromQuery] Guid? assignedTo)
    {
        var q = _db.Tickets.AsQueryable();
        if (status.HasValue) q = q.Where(t => t.Status == status.Value);
        if (priority.HasValue) q = q.Where(t => t.Priority == priority.Value);
        if (assignedTo.HasValue) q = q.Where(t => t.AssignedAgentId == assignedTo.Value);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            q = q.Where(t => t.Title.ToLower().Contains(s) || (t.Description ?? "").ToLower().Contains(s));
        }
        var items = await q.OrderByDescending(t => t.UpdatedAt).ToListAsync();
        return Ok(items.Select(t => t.ToDto()));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TicketDto>> Get(Guid id)
    {
        var t = await _db.Tickets.FindAsync(id);
        if (t == null) return NotFound();
        return Ok(t.ToDto());
    }

    public record CreateTicketRequest(string Title, string? Description, TicketPriority Priority);
    [HttpPost]
    public async Task<ActionResult<TicketDto>> Create([FromBody] CreateTicketRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Title)) return BadRequest("Title is required.");
        var t = new Ticket
        {
            Title = req.Title.Trim(),
            Description = req.Description?.Trim(),
            Priority = req.Priority,
            Status = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Tickets.Add(t);
        await _db.SaveChangesAsync();
        var dto = t.ToDto();
        await _hub.Clients.All.SendAsync("ticketUpdated", dto);
        return CreatedAtAction(nameof(Get), new { id = t.Id }, dto);
    }

    public record UpdateTicketRequest(string Title, string? Description, TicketPriority Priority, TicketStatus Status, Guid? AssignedAgentId);
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TicketDto>> Update(Guid id, [FromBody] UpdateTicketRequest req)
    {
        var t = await _db.Tickets.FindAsync(id);
        if (t == null) return NotFound();

        if (string.IsNullOrWhiteSpace(req.Title)) return BadRequest("Title is required.");
        t.Title = req.Title.Trim();
        t.Description = req.Description?.Trim();
        t.Priority = req.Priority;
        t.Status = req.Status;
        t.AssignedAgentId = req.AssignedAgentId;
        t.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        var dto = t.ToDto();
        await _hub.Clients.All.SendAsync("ticketUpdated", dto);
        return Ok(dto);
    }

    public record StatusRequest(TicketStatus Status);
    [HttpPost("{id:guid}/status")]
    public async Task<ActionResult<TicketDto>> SetStatus(Guid id, [FromBody] StatusRequest req)
    {
        var t = await _db.Tickets.FindAsync(id);
        if (t == null) return NotFound();
        t.Status = req.Status;
        t.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        var dto = t.ToDto();
        await _hub.Clients.All.SendAsync("ticketUpdated", dto);
        return Ok(dto);
    }

    [HttpPost("{id:guid}/assign/{agentId:guid}")]
    public async Task<ActionResult<TicketDto>> Assign(Guid id, Guid agentId)
    {
        var t = await _db.Tickets.FindAsync(id);
        if (t == null) return NotFound();
        var agent = await _db.Agents.FindAsync(agentId);
        if (agent == null) return BadRequest("Agent not found.");
        t.AssignedAgentId = agent.Id;
        t.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        var dto = t.ToDto();
        await _hub.Clients.All.SendAsync("ticketUpdated", dto);
        return Ok(dto);
    }
}