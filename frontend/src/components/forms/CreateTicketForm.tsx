import { useState } from 'react'
import { UIService } from '../../services/uiService'
import type { TicketPriority } from '../../types'

interface CreateTicketFormProps {
  isExpanded: boolean
  onToggle: () => void
  onSubmit: (data: { title: string; description: string; priority: TicketPriority }) => Promise<boolean>
}

export function CreateTicketForm({ isExpanded, onToggle, onSubmit }: CreateTicketFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as TicketPriority
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const priorityOptions: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical']
  const selectBoxStyle = UIService.getSelectBoxStyle()

  const handleInputChange = (field: keyof typeof formData, value: string | TicketPriority) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    try {
      const success = await onSubmit(formData)
      if (success) {
        setFormData({ title: '', description: '', priority: 'Medium' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="create-ticket-form" className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${UIService.getResponsivePadding(4)} mb-6 md:mb-8`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-semibold text-gray-900 ${UIService.getResponsiveText('lg')}`}>
          Create New Ticket
        </h2>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm sm:text-base"
          type="button"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
          <svg 
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter ticket title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer relative z-10"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as TicketPriority)}
                disabled={isSubmitting}
                style={selectBoxStyle}
              >
                {priorityOptions.map(p => (
                  <option key={p} value={p} className="text-gray-900 bg-white">
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows={3}
                placeholder="Describe the issue..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
