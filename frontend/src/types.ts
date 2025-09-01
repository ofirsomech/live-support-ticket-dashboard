export type TicketStatus = 'Open' | 'InProgress' | 'Resolved'
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface Ticket {
  id: string
  title: string
  description?: string | null
  priority: TicketPriority
  status: TicketStatus
  assignedAgentId?: string | null
  createdAt: string
  updatedAt: string
}

export interface Agent {
  id: string
  name: string
  email?: string | null
}