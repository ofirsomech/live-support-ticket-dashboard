import { api } from './client'
import type { Ticket, TicketPriority, TicketStatus } from '../types'

export const TicketsApi = {
  list: (params?: { status?: TicketStatus; priority?: TicketPriority; search?: string; assignedTo?: string }) => {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    if (params?.priority) qs.set('priority', params.priority)
    if (params?.search) qs.set('search', params.search)
    if (params?.assignedTo) qs.set('assignedTo', params.assignedTo)
    const q = qs.toString() ? `?${qs.toString()}` : ''
    return api<Ticket[]>(`/api/tickets${q}`)
  },
  get: (id: string) => api<Ticket>(`/api/tickets/${id}`),
  create: (data: { title: string; description?: string; priority: TicketPriority }) =>
    api<Ticket>(`/api/tickets`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { title: string; description?: string; priority: TicketPriority; status: TicketStatus; assignedAgentId?: string | null }) =>
    api<Ticket>(`/api/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  setStatus: (id: string, status: TicketStatus) =>
    api<Ticket>(`/api/tickets/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) }),
  assign: (id: string, agentId: string) =>
    api<Ticket>(`/api/tickets/${id}/assign/${agentId}`, { method: 'POST' }),
}

export const AgentsApi = {
  list: () => api(`/api/agents` as any),
}