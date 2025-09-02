import create from 'zustand'
import type { Ticket, TicketPriority, TicketStatus, Agent } from '../types'
import { TicketsApi, AgentsApi } from '../api/tickets'
import { getConnection } from '../lib/signalr'

interface State {
  tickets: Ticket[]
  agents: Agent[]
  loading: boolean
  error?: string
  filters: { status?: TicketStatus; priority?: TicketPriority; search?: string }
  loadAll: () => Promise<void>
  applyFilters: (f: Partial<State['filters']>) => void
  createTicket: (data: { title: string; description?: string; priority: TicketPriority }) => Promise<void>
  updateTicket: (t: Ticket) => Promise<void>
}

export const useStore = create<State>((set, get) => ({
  tickets: [],
  agents: [],
  loading: false,
  filters: {},
  loadAll: async () => {
    set({ loading: true, error: undefined })
    try {
      const [tickets, agents] = await Promise.all([
        TicketsApi.list(get().filters),
        AgentsApi.list() as Promise<Agent[]>,
      ])
      set({ tickets, agents })
      const conn = getConnection()
      conn.on('ticketUpdated', (t: Ticket) => {
        set(s => {
          const idx = s.tickets.findIndex(x => x.id === t.id)
          if (idx >= 0) {
            const next = s.tickets.slice()
            next[idx] = t
            return { tickets: next }
          }
          return { tickets: [t, ...s.tickets] }
        })
      })
      if (conn.state === 'Disconnected') await conn.start()
    } catch (e: any) {
      set({ error: e.message })
    } finally {
      set({ loading: false })
    }
  },
  applyFilters: (f) => set(s => ({ filters: { ...s.filters, ...f } })),
  createTicket: async (data) => {
    const t = await TicketsApi.create(data)
    set(s => ({ tickets: [t, ...s.tickets] }))
  },
  updateTicket: async (t) => {
    const updated = await TicketsApi.update(t.id, {
      title: t.title,
      description: t.description ?? '',
      priority: t.priority,
      status: t.status,
      assignedAgentId: t.assignedAgentId ?? null,
    })
    set(s => {
      const idx = s.tickets.findIndex(x => x.id === updated.id)
      const next = s.tickets.slice()
      if (idx >= 0) next[idx] = updated
      return { tickets: next }
    })
  },
}))