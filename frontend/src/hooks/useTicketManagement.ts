import { useState, useCallback } from 'react'
import { useStore } from '../store/useTicketsStore'
import { useNotifications } from '../components/NotificationSystem'
import { TicketService, type CreateTicketData } from '../services/ticketService'
import type { Ticket, TicketPriority, TicketStatus } from '../types'

export function useTicketManagement() {
  const { tickets, agents, loading, error, loadAll, applyFilters, createTicket, updateTicket, filters } = useStore()
  const { addNotification } = useNotifications()
  const [isFormExpanded, setIsFormExpanded] = useState(false)

  /**
   * Handle ticket creation with validation and notifications
   */
  const handleCreateTicket = useCallback(async (data: CreateTicketData) => {
    // Validate ticket data
    const validation = TicketService.validateTicketData(data)
    if (!validation.isValid) {
      addNotification({
        type: 'error',
        title: 'Validation Failed',
        message: validation.errors.join(', '),
        duration: 5000
      })
      return false
    }

    try {
      await createTicket(data)
      setIsFormExpanded(false)
      addNotification({
        type: 'success',
        title: 'Ticket Created',
        message: `"${data.title}" has been created successfully`,
        duration: 3000
      })
      return true
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create ticket. Please try again.',
        duration: 5000
      })
      return false
    }
  }, [createTicket, addNotification])

  /**
   * Handle ticket updates with notifications
   */
  const handleTicketUpdate = useCallback(async (ticket: Ticket) => {
    try {
      await updateTicket(ticket)
      addNotification({
        type: 'success',
        title: 'Ticket Updated',
        message: `"${ticket.title}" has been updated`,
        duration: 2000
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update ticket. Please try again.',
        duration: 5000
      })
    }
  }, [updateTicket, addNotification])

  /**
   * Handle data refresh with notifications
   */
  const handleRefresh = useCallback(async () => {
    try {
      await loadAll()
      addNotification({
        type: 'success',
        title: 'Data Refreshed',
        message: 'All data has been refreshed successfully',
        duration: 2000
      })
      return true
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh data. Please try again.',
        duration: 5000
      })
      return false
    }
  }, [loadAll, addNotification])

  /**
   * Get grouped tickets for display
   */
  const getGroupedTickets = useCallback(() => {
    return TicketService.groupTicketsByStatus(tickets)
  }, [tickets])

  /**
   * Get ticket statistics
   */
  const getTicketStats = useCallback(() => {
    return TicketService.calculateStats(tickets)
  }, [tickets])

  /**
   * Filter tickets based on current filters
   */
  const getFilteredTickets = useCallback(() => {
    return TicketService.filterTickets(tickets, filters)
  }, [tickets, filters])

  /**
   * Expand the create ticket form
   */
  const expandForm = useCallback(() => {
    setIsFormExpanded(true)
  }, [])

  /**
   * Collapse the create ticket form
   */
  const collapseForm = useCallback(() => {
    setIsFormExpanded(false)
  }, [])

  /**
   * Toggle form expansion state
   */
  const toggleForm = useCallback(() => {
    setIsFormExpanded(!isFormExpanded)
  }, [isFormExpanded])

  return {
    // State
    tickets,
    agents,
    loading,
    error,
    filters,
    isFormExpanded,
    
    // Actions
    handleCreateTicket,
    handleTicketUpdate,
    handleRefresh,
    applyFilters,
    loadAll,
    
    // Computed values
    getGroupedTickets,
    getTicketStats,
    getFilteredTickets,
    
    // Form management
    expandForm,
    collapseForm,
    toggleForm,
  }
}
