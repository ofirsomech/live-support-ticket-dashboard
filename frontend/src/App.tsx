import { useEffect, useMemo, useState } from 'react'
import { useStore } from './store/useTicketsStore'
import type { Ticket, TicketPriority, TicketStatus } from './types'
import { InteractiveDashboard } from './components/InteractiveDashboard'
import { NotificationSystem, useNotifications } from './components/NotificationSystem'
import { FloatingActionButton } from './components/FloatingActionButton'

const statusOpts: TicketStatus[] = ['Open', 'InProgress', 'Resolved']
const priorityOpts: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical']

export default function App() {
  const { tickets, agents, loading, error, loadAll, applyFilters, createTicket, updateTicket, filters } = useStore()
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium' as TicketPriority })
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const { notifications, addNotification, removeNotification } = useNotifications()

  useEffect(() => { loadAll() }, [])
  useEffect(() => { loadAll() }, [filters.status, filters.priority, filters.search])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    
    try {
      await createTicket(form)
      setForm({ title: '', description: '', priority: 'Medium' })
      setIsFormExpanded(false)
      addNotification({
        type: 'success',
        title: 'Ticket Created',
        message: `"${form.title}" has been created successfully`,
        duration: 3000
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create ticket. Please try again.',
        duration: 5000
      })
    }
  }

  const handleTicketUpdate = async (ticket: Ticket) => {
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
  }

  const handleQuickCreate = () => {
    setIsFormExpanded(true)
    // Scroll to form
    document.querySelector('#create-ticket-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleRefresh = async () => {
    try {
      await loadAll()
      addNotification({
        type: 'success',
        title: 'Data Refreshed',
        message: 'All data has been refreshed successfully',
        duration: 2000
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh data. Please try again.',
        duration: 5000
      })
    }
  }

  const handleViewStats = () => {
    // Scroll to stats section
    document.querySelector('#stats-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const grouped = useMemo(() => {
    return {
      Open: tickets.filter(t => t.status === 'Open'),
      InProgress: tickets.filter(t => t.status === 'InProgress'),
      Resolved: tickets.filter(t => t.status === 'Resolved'),
    }
  }, [tickets])

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'InProgress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'Critical': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Support Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage and track support tickets in real-time</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search tickets..."
                  onChange={(e) => applyFilters({ search: e.target.value })}
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                onChange={(e) => applyFilters({ status: e.target.value as TicketStatus || undefined })}
              >
                <option value="">All Statuses</option>
                {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                onChange={(e) => applyFilters({ priority: e.target.value as TicketPriority || undefined })}
              >
                <option value="">All Priorities</option>
                {priorityOpts.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div id="stats-section" className="grid grid-cols-4 gap-6 mb-6">
            {Object.entries(grouped).map(([status, tickets]) => (
              <div key={status} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{status}</p>
                    <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
                  </div>
                  <div className={`p-3 rounded-full ${getStatusColor(status as TicketStatus)}`}>
                    {status === 'Open' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {status === 'InProgress' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {status === 'Resolved' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Create Ticket Form */}
        <section id="create-ticket-form" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
            <button
              onClick={() => setIsFormExpanded(!isFormExpanded)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              {isFormExpanded ? 'Collapse' : 'Expand'}
              <svg className={`w-5 h-5 transition-transform duration-200 ${isFormExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {isFormExpanded && (
            <form onSubmit={onCreate} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter ticket title"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={form.priority}
                    onChange={(e) => setForm(f => ({ ...f, priority: e.target.value as TicketPriority }))}
                  >
                    {priorityOpts.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={3}
                    placeholder="Describe the issue..."
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          )}
        </section>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Interactive Kanban Board */}
        <InteractiveDashboard
          tickets={tickets}
          agents={agents}
          onUpdate={handleTicketUpdate}
          priorityColor={getPriorityColor}
        />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onQuickCreate={handleQuickCreate}
        onRefresh={handleRefresh}
        onViewStats={handleViewStats}
      />

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  )
}