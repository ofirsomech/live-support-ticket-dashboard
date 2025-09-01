# ADR-0001: Architecture & Technology Choices

## Context
We need a production-ready Live Support Ticket Dashboard with:
- React + TypeScript frontend
- .NET Core (8) Web API backend
- Real-time updates (SignalR)
- Simple persistence
- Basic auth (mocked), error handling, and documentation

## Decision
- **Frontend:** React + TypeScript + Vite. UI with TailwindCSS; state via **Zustand** for simplicity and testability. Real-time via **@microsoft/signalr** client.
- **Backend:** .NET 8 Web API with **EF Core** and **SQLite** for local dev. **SignalR** hub for live updates. Swagger for API docs, HealthChecks for readiness.
- **DB:** SQLite for MVP & local development (simple, file-based). Migratable to Postgres in production by swapping the provider.
- **API Style:** RESTful resources for tickets and agents; DTOs and validation attributes.
- **Auth:** Simplified (mocked user via header `x-user-id`). Replaceable with real auth (JWT/OpenId) later.
- **Testing:** Vitest for FE unit tests; xUnit for BE example test.
- **Dev Experience:** CORS enabled for `http://localhost:5173`. Backend on `http://localhost:5182`.
- **Docs:** README with setup; Swagger provides live API examples.

## Consequences
- Fast iteration and easy local setup.
- Clear separation of concerns and extensible layering.
- Real-time is encapsulated via SignalR, swappable with message bus later if needed.
- SQLite is not for high-scale prod, but acceptable for MVP and demo.