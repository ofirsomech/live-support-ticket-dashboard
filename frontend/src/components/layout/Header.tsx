import { useState } from 'react'
import { UIService } from '../../services/uiService'
import type { TicketPriority, TicketStatus } from '../../types'

interface HeaderProps {
  title: string
  subtitle: string
  filters: {
    status?: TicketStatus
    priority?: TicketPriority
    search?: string
  }
  onFilterChange: (filters: { status?: TicketStatus; priority?: TicketPriority; search?: string }) => void
  stats: {
    Open: number
    InProgress: number
    Resolved: number
  }
}

export function Header({ title, subtitle, filters, onFilterChange, stats }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const statusOptions: TicketStatus[] = ['Open', 'InProgress', 'Resolved']
  const priorityOptions: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical']
  const selectBoxStyle = UIService.getSelectBoxStyle()

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search })
  }

  const handleStatusChange = (status: TicketStatus | '') => {
    onFilterChange({ ...filters, status: status || undefined })
  }

  const handlePriorityChange = (priority: TicketPriority | '') => {
    onFilterChange({ ...filters, priority: priority || undefined })
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="mb-6 md:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${UIService.getResponsiveText('2xl')}`}>
            {title}
          </h1>
          <p className={`text-gray-600 mt-2 ${UIService.getResponsiveText('sm')}`}>
            {subtitle}
          </p>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            aria-label="Toggle mobile menu"
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
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900 appearance-none cursor-pointer relative z-10"
                value={filters.status || ''}
                onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                style={selectBoxStyle}
              >
                <option value="">All Statuses</option>
                {statusOptions.map(s => (
                  <option key={s} value={s} className="text-gray-900 bg-white">
                    {s}
                  </option>
                ))}
              </select>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900 appearance-none cursor-pointer relative z-10"
                value={filters.priority || ''}
                onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                style={selectBoxStyle}
              >
                <option value="">All Priorities</option>
                {priorityOptions.map(p => (
                  <option key={p} value={p} className="text-gray-900 bg-white">
                    {p}
                  </option>
                ))}
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
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer relative z-10"
          value={filters.status || ''}
          onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
          style={selectBoxStyle}
        >
          <option value="">All Statuses</option>
          {statusOptions.map(s => (
            <option key={s} value={s} className="text-gray-900 bg-white">
              {s}
            </option>
          ))}
        </select>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer relative z-10"
          value={filters.priority || ''}
          onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
          style={selectBoxStyle}
        >
          <option value="">All Priorities</option>
          {priorityOptions.map(p => (
            <option key={p} value={p} className="text-gray-900 bg-white">
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div id="stats-section" className={`grid grid-cols-2 sm:grid-cols-4 ${UIService.getResponsiveGap(3)} mb-6`}>
        {Object.entries(stats).map(([status, count]) => (
          <div key={status} className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${UIService.getResponsivePadding(4)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium text-gray-600 ${UIService.getResponsiveText('xs')}`}>
                  {status}
                </p>
                <p className={`font-bold text-gray-900 ${UIService.getResponsiveText('2xl')}`}>
                  {count}
                </p>
              </div>
              <div className={`rounded-full ${UIService.getStatusColor(status as TicketStatus)} ${UIService.getResponsivePadding(2)}`}>
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
  )
}
