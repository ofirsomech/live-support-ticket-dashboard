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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  const selectBoxStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 8px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '32px'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Support Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage and track support tickets in real-time</p>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="space-y-3">
                <div className="relative">
                  <input
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Search tickets..."
                    onChange={(e) => applyFilters({ search: e.target.value })}
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900 appearance-none cursor-pointer relative z-10"
                    onChange={(e) => applyFilters({ status: e.target.value as TicketStatus || undefined })}
                    style={selectBoxStyle}
                  >
                    <option value="">All Statuses</option>
                    {statusOpts.map(s => <option key={s} value={s} className="text-gray-900 bg-white">{s}</option>)}
                  </select>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900 appearance-none cursor-pointer relative z-10"
                    onChange={(e) => applyFilters({ priority: e.target.value as TicketPriority || undefined })}
                    style={selectBoxStyle}
                  >
                    <option value="">All Priorities</option>
                    {priorityOpts.map(p => <option key={p} value={p} className="text-gray-900 bg-white">{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-4">
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer relative z-10"
              onChange={(e) => applyFilters({ status: e.target.value as TicketStatus || undefined })}
              style={selectBoxStyle}
            >
              <option value="">All Statuses</option>
              {statusOpts.map(s => <option key={s} value={s} className="text-gray-900 bg-white">{s}</option>)}
            </select>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer relative z-10"
              onChange={(e) => applyFilters({ priority: e.target.value as TicketPriority || undefined })}
              style={selectBoxStyle}
            >
              <option value="">All Priorities</option>
              {priorityOpts.map(p => <option key={p} value={p} className="text-gray-900 bg-white">{p}</option>)}
            </select>
          </div>

          {/* Stats */}
          <div id="stats-section" className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6">
            {Object.entries(grouped).map(([status, tickets]) => (
              <div key={status} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{status}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{tickets.length}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${getStatusColor(status as TicketStatus)}`}>
                    {status === 'Open' && (
                      <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {status === 'InProgress' && (
                      <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {status === 'Resolved' && (
                      <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <section id="create-ticket-form" className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 md:mb-8 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Ticket</h2>
            <button
              onClick={() => setIsFormExpanded(!isFormExpanded)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm sm:text-base"
            >
              {isFormExpanded ? 'Collapse' : 'Expand'}
              <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isFormExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {isFormExpanded && (
            <form onSubmit={onCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter ticket title"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer relative z-10"
                    value={form.priority}
                    onChange={(e) => setForm(f => ({ ...f, priority: e.target.value as TicketPriority }))}
                    style={selectBoxStyle}
                  >
                    {priorityOpts.map(p => <option key={p} value={p} className="text-gray-900 bg-white">{p}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          )}
        </section>

        {loading && (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
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

      {/* Floating Action Button - Hidden on mobile */}
      <div className="hidden sm:block">
        <FloatingActionButton
          onQuickCreate={handleQuickCreate}
          onRefresh={handleRefresh}
          onViewStats={handleViewStats}
        />
      </div>

      {/* Mobile Quick Actions */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
          <div className="flex items-center justify-around">
            <button
              onClick={handleQuickCreate}
              className="flex flex-col items-center p-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
              title="Quick Create"
            >
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs">Create</span>
            </button>
            
            <button
              onClick={handleRefresh}
              className="flex flex-col items-center p-2 text-green-600 hover:text-green-700 transition-colors duration-200"
              title="Refresh"
            >
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs">Refresh</span>
            </button>
            
            <button
              onClick={handleViewStats}
              className="flex flex-col items-center p-2 text-purple-600 hover:text-purple-700 transition-colors duration-200"
              title="Stats"
            >
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs">Stats</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  )
}