# Live Support Ticket Dashboard (React + TypeScript + .NET 8)

This is a production-minded MVP showing tickets CRUD, assignment, filtering, and **real-time** updates via SignalR.

## Stack
- **Frontend:** React + TypeScript + Vite, TailwindCSS, Zustand, @microsoft/signalr
- **Backend:** .NET 8 Web API, EF Core (SQLite), SignalR, Swagger, HealthChecks

## Quick Start

### Prereqs
- Node 18+ and pnpm (or npm/yarn)
- .NET 8 SDK

### 1) Backend
```bash
cd backend
dotnet restore
dotnet build
dotnet run
```
Backend default URL: **http://localhost:5182**  
Swagger: **http://localhost:5182/swagger**  
Health: **http://localhost:5182/health**

> On first run, a SQLite DB file `tickets.db` is created automatically with a few seed tickets.

### 2) Frontend
```bash
cd frontend
pnpm install   # or npm install / yarn
pnpm dev       # or npm run dev / yarn dev
```
Frontend dev URL: **http://localhost:5173**

### Configuration
- FE expects API at `VITE_API_URL=http://localhost:5182`
- SignalR hub: `http://localhost:5182/hubs/tickets`

Create `.env` in `frontend` if needed:
```
VITE_API_URL=http://localhost:5182
```

## API Overview
- `GET /api/tickets?status=&priority=&search=&assignedTo=`
- `GET /api/tickets/{id}`
- `POST /api/tickets` (title, description, priority)
- `PUT /api/tickets/{id}` (full update incl. status/assignment)
- `POST /api/tickets/{id}/status` (body: { status: "Open|InProgress|Resolved" })
- `POST /api/tickets/{id}/assign/{agentId}`
- `GET /api/agents`

**SignalR events:**
- Server -> Client: `ticketUpdated` (payload: TicketDto)

## Testing
- **Frontend:** `pnpm test` (Vitest)
- **Backend:** `dotnet test`

## Notes
- Mock auth: add header `x-user-id` to simulate current agent.
- CORS allows `http://localhost:5173` by default.
- Swap SQLite with Postgres in `Program.cs` for production.