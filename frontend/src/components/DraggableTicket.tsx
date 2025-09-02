import { useState, useRef, useEffect } from 'react'
import type { Ticket, TicketPriority, TicketStatus } from '../types'

interface DraggableTicketProps {
  ticket: Ticket
  agents: any[]
  onUpdate: (t: Ticket) => Promise<void>
  priorityColor: (priority: TicketPriority) => string
  onDragStart: (e: React.DragEvent, ticket: Ticket) => void
  onDragEnd: () => void
  isDragging: boolean
}

export function DraggableTicket({ 
  ticket, 
  agents, 
  onUpdate, 
  priorityColor, 
  onDragStart, 
  onDragEnd, 
  isDragging 
}: DraggableTicketProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [edit, setEdit] = useState(ticket)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => setEdit(ticket), [ticket.id])

  const save = async () => { 
    await onUpdate(edit)
    setIsEditing(false)
  }

  const cancel = () => {
    setEdit(ticket)
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, ticket)}
      onDragEnd={onDragEnd}
      className={`bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 cursor-move ${
        isDragging ? 'opacity-50 scale-95 rotate-2' : ''
      } ${isHovered ? 'shadow-lg border-gray-300' : 'hover:shadow-md hover:border-gray-300'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isEditing ? (
        <div>
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 mr-3">
              {ticket.title}
            </h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColor(ticket.priority)}`}>
              {ticket.priority}
            </span>
          </div>
          
          {ticket.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {ticket.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>Created {formatDate(ticket.createdAt)}</span>
            {ticket.updatedAt !== ticket.createdAt && (
              <span>Updated {formatDate(ticket.updatedAt)}</span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <select 
              className="text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={ticket.status} 
              onChange={e => onUpdate({ ...ticket, status: e.target.value as TicketStatus })}
            >
              <option>Open</option>
              <option>InProgress</option>
              <option>Resolved</option>
            </select>
            
            <select 
              className="text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={ticket.assignedAgentId ?? ''} 
              onChange={e => onUpdate({ ...ticket, assignedAgentId: e.target.value || null })}
            >
              <option value="">Unassigned</option>
              {agents.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            
            <button 
              className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors duration-200"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="space-y-3">
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={edit.title} 
              onChange={e => setEdit({ ...edit, title: e.target.value })} 
            />
            
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={2} 
              value={edit.description ?? ''} 
              onChange={e => setEdit({ ...edit, description: e.target.value })} 
            />
            
            <div className="flex items-center gap-2">
              <select 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={edit.status} 
                onChange={e => setEdit({ ...edit, status: e.target.value as TicketStatus })}
              >
                <option>Open</option>
                <option>InProgress</option>
                <option>Resolved</option>
              </select>
              
              <select 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={edit.assignedAgentId ?? ''} 
                onChange={e => setEdit({ ...edit, assignedAgentId: e.target.value || null })}
              >
                <option value="">Unassigned</option>
                {agents.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            
            <div className="flex gap-2">
              <button 
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                onClick={save}
              >
                Save
              </button>
              <button 
                className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm"
                onClick={cancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
