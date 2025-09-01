using Microsoft.EntityFrameworkCore;
using SupportDesk.Api.Entities;

namespace SupportDesk.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<Agent> Agents => Set<Agent>();
}