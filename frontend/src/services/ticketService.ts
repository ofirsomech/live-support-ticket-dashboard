import type { Ticket, TicketPriority, TicketStatus } from '../types'

export interface CreateTicketData {
  title: string
  description: string
  priority: TicketPriority
}

export interface TicketFilters {
  status?: TicketStatus
  priority?: TicketPriority
  search?: string
}

export interface TicketStats {
  Open: number
  InProgress: number
  Resolved: number
}

export class TicketService {
  /**
   * Group tickets by status for statistics and display
   */
  static groupTicketsByStatus(tickets: Ticket[]): Record<TicketStatus, Ticket[]> {
    return {
      Open: tickets.filter(t => t.status === 'Open'),
      InProgress: tickets.filter(t => t.status === 'InProgress'),
      Resolved: tickets.filter(t => t.status === 'Resolved'),
    }
  }

  /**
   * Calculate ticket statistics
   */
  static calculateStats(tickets: Ticket[]): TicketStats {
    const grouped = this.groupTicketsByStatus(tickets)
    return {
      Open: grouped.Open.length,
      InProgress: grouped.InProgress.length,
      Resolved: grouped.Resolved.length,
    }
  }

  /**
   * Filter tickets based on criteria
   */
  static filterTickets(tickets: Ticket[], filters: TicketFilters): Ticket[] {
    let filtered = [...tickets]

    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status)
    }

    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        (t.description && t.description.toLowerCase().includes(searchLower))
      )
    }

    return filtered
  }

  /**
   * Validate ticket data before creation
   */
  static validateTicketData(data: CreateTicketData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.title.trim()) {
      errors.push('Title is required')
    }

    if (data.title.length > 100) {
      errors.push('Title must be less than 100 characters')
    }

    if (data.description && data.description.length > 1000) {
      errors.push('Description must be less than 1000 characters')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Format date for display
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Check if ticket was updated after creation
   */
  static wasTicketUpdated(ticket: Ticket): boolean {
    return ticket.updatedAt !== ticket.createdAt
  }
}
