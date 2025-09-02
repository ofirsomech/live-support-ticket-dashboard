import { useEffect } from 'react'
import { Header } from '../layout/Header'
import { CreateTicketForm } from '../forms/CreateTicketForm'
import { LoadingErrorStates } from '../layout/LoadingErrorStates'
import { InteractiveDashboard } from '../InteractiveDashboard'
import { FloatingActionButton } from '../FloatingActionButton'
import { MobileQuickActions } from '../layout/MobileQuickActions'
import { NotificationSystem, useNotifications } from '../NotificationSystem'
import { useTicketManagement } from '../../hooks/useTicketManagement'
import { UIService } from '../../services/uiService'
import type { TicketStatus, TicketPriority } from '../../types'

export function Dashboard() {
  const {
    tickets,
    agents,
    loading,
    error,
    filters,
    isFormExpanded,
    handleCreateTicket,
    handleTicketUpdate,
    handleRefresh,
    applyFilters,
    loadAll,
    expandForm,
    toggleForm,
  } = useTicketManagement()

  const { notifications, removeNotification } = useNotifications()

  // Load data on mount and when filters change
  useEffect(() => {
    loadAll()
  }, [loadAll])

  useEffect(() => {
    loadAll()
  }, [filters.status, filters.priority, filters.search, loadAll])

  const handleQuickCreate = () => {
    expandForm()
    // Scroll to form
    document.querySelector('#create-ticket-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleViewStats = () => {
    // Scroll to stats section
    document.querySelector('#stats-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFilterChange = (newFilters: { status?: TicketStatus; priority?: TicketPriority; search?: string }) => {
    applyFilters(newFilters)
  }

  return (
    <>
      <Header
        title="Support Dashboard"
        subtitle="Manage and track support tickets in real-time"
        filters={filters}
        onFilterChange={handleFilterChange}
        stats={{
          Open: tickets.filter(t => t.status === 'Open').length,
          InProgress: tickets.filter(t => t.status === 'InProgress').length,
          Resolved: tickets.filter(t => t.status === 'Resolved').length,
        }}
      />

      <CreateTicketForm
        isExpanded={isFormExpanded}
        onToggle={toggleForm}
        onSubmit={handleCreateTicket}
      />

      <LoadingErrorStates loading={loading} error={error} />

      <InteractiveDashboard
        tickets={tickets}
        agents={agents}
        onUpdate={handleTicketUpdate}
        priorityColor={UIService.getPriorityColor}
      />

      {/* Floating Action Button - Hidden on mobile */}
      <div className="hidden sm:block">
        <FloatingActionButton
          onQuickCreate={handleQuickCreate}
          onRefresh={handleRefresh}
          onViewStats={handleViewStats}
        />
      </div>

      {/* Mobile Quick Actions */}
      <MobileQuickActions
        onQuickCreate={handleQuickCreate}
        onRefresh={handleRefresh}
        onViewStats={handleViewStats}
      />

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </>
  )
}
