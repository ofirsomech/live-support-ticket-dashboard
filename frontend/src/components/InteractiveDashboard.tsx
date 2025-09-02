import { useState, useRef, useEffect } from 'react'
import type { Ticket, TicketPriority, TicketStatus } from '../types'
import { DraggableTicket } from './DraggableTicket'

interface InteractiveDashboardProps {
  tickets: Ticket[]
  agents: any[]
  onUpdate: (t: Ticket) => Promise<void>
  priorityColor: (priority: TicketPriority) => string
}

export function InteractiveDashboard({ 
  tickets, 
  agents, 
  onUpdate, 
  priorityColor 
}: InteractiveDashboardProps) {
  const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<TicketStatus | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const grouped = {
    Open: tickets.filter(t => t.status === 'Open'),
    InProgress: tickets.filter(t => t.status === 'InProgress'),
    Resolved: tickets.filter(t => t.status === 'Resolved'),
  }

  const handleDragStart = (e: React.DragEvent, ticket: Ticket) => {
    if (isMobileView) return // Disable drag on mobile
    setDraggedTicket(ticket)
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', ticket.id)
  }

  const handleDragEnd = () => {
    setDraggedTicket(null)
    setDragOverColumn(null)
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent, status: TicketStatus) => {
    if (isMobileView) return // Disable drag on mobile
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(status)
  }

  const handleDrop = async (e: React.DragEvent, targetStatus: TicketStatus) => {
    if (isMobileView) return // Disable drag on mobile
    e.preventDefault()
    if (draggedTicket && draggedTicket.status !== targetStatus) {
      await onUpdate({ ...draggedTicket, status: targetStatus })
    }
    setDragOverColumn(null)
  }

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'InProgress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'InProgress':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'Resolved':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  // Mobile view - single column layout
  if (isMobileView) {
    return (
      <div className="space-y-4">
        {(['Open', 'InProgress', 'Resolved'] as TicketStatus[]).map(col => (
          <div
            key={col}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <header className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(col)}`}>
                  {getStatusIcon(col)}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{col}</h3>
              </div>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {grouped[col].length}
              </span>
            </header>
            
            <div className="space-y-3">
              {grouped[col].map(ticket => (
                <DraggableTicket
                  key={ticket.id}
                  ticket={ticket}
                  agents={agents}
                  onUpdate={onUpdate}
                  priorityColor={priorityColor}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={false}
                  isMobile={true}
                />
              ))}
              
              {grouped[col].length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No tickets</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Desktop view - grid layout with drag & drop
  return (
    <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
      {(['Open', 'InProgress', 'Resolved'] as TicketStatus[]).map(col => (
        <div
          key={col}
          className={`bg-white rounded-xl shadow-sm border-2 border-dashed transition-all duration-200 ${
            dragOverColumn === col 
              ? 'border-blue-400 bg-blue-50 shadow-lg' 
              : 'border-gray-100 hover:shadow-md'
          }`}
          onDragOver={(e) => handleDragOver(e, col)}
          onDrop={(e) => handleDrop(e, col)}
        >
          <header className="flex items-center justify-between mb-4 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getStatusColor(col)}`}>
                {getStatusIcon(col)}
              </div>
              <h3 className="font-semibold text-gray-900">{col}</h3>
            </div>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {grouped[col].length}
            </span>
          </header>
          
          <div className="p-4 pt-0 space-y-3 min-h-[300px]">
            {grouped[col].map(ticket => (
              <DraggableTicket
                key={ticket.id}
                ticket={ticket}
                agents={agents}
                onUpdate={onUpdate}
                priorityColor={priorityColor}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isDragging={isDragging && draggedTicket?.id === ticket.id}
                isMobile={false}
              />
            ))}
            
            {grouped[col].length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium">No tickets</p>
                <p className="text-xs mt-1">Drag tickets here or create new ones</p>
              </div>
            )}
            
            {/* Drop zone indicator */}
            {dragOverColumn === col && draggedTicket && draggedTicket.status !== col && (
              <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-blue-600 text-sm font-medium">
                  Drop "{draggedTicket.title}" here
                </p>
                <p className="text-blue-500 text-xs mt-1">
                  Move to {col}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
