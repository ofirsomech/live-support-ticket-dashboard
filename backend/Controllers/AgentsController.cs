using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupportDesk.Api.Data;
using SupportDesk.Api.Entities;

namespace SupportDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgentsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AgentsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Agent>>> List()
    {
        var items = await _db.Agents.AsNoTracking().ToListAsync();
        return Ok(items);
    }
}