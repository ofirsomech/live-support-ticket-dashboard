import type { TicketPriority, TicketStatus } from '../types'

export class UIService {
  /**
   * Get status color scheme for styling
   */
  static getStatusColor(status: TicketStatus): string {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'InProgress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  /**
   * Get priority color scheme for styling
   */
  static getPriorityColor(priority: TicketPriority): string {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'Critical': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  /**
   * Get select box styling for consistent appearance
   */
  static getSelectBoxStyle() {
    return {
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 8px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      paddingRight: '32px'
    }
  }

  /**
   * Get responsive text classes based on screen size
   */
  static getResponsiveText(size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'): string {
    const sizeMap = {
      xs: 'text-xs sm:text-sm',
      sm: 'text-sm sm:text-base',
      base: 'text-base sm:text-lg',
      lg: 'text-lg sm:text-xl',
      xl: 'text-xl sm:text-2xl',
      '2xl': 'text-2xl sm:text-3xl',
      '3xl': 'text-3xl sm:text-4xl',
      '4xl': 'text-4xl sm:text-5xl'
    }
    return sizeMap[size]
  }

  /**
   * Get responsive padding classes based on screen size
   */
  static getResponsivePadding(size: 2 | 3 | 4 | 6 | 8): string {
    const sizeMap = {
      2: 'p-2 sm:p-3',
      3: 'p-3 sm:p-4',
      4: 'p-4 sm:p-6',
      6: 'p-6 sm:p-8',
      8: 'p-8 sm:p-12'
    }
    return sizeMap[size]
  }

  /**
   * Get responsive margin classes based on screen size
   */
  static getResponsiveMargin(size: 2 | 3 | 4 | 6 | 8): string {
    const sizeMap = {
      2: 'm-2 sm:m-3',
      3: 'm-3 sm:m-4',
      4: 'm-4 sm:m-6',
      6: 'm-6 sm:m-8',
      8: 'm-8 sm:m-12'
    }
    return sizeMap[size]
  }

  /**
   * Get responsive gap classes based on screen size
   */
  static getResponsiveGap(size: 2 | 3 | 4 | 6): string {
    const sizeMap = {
      2: 'gap-2 sm:gap-3',
      3: 'gap-3 sm:gap-4',
      4: 'gap-4 sm:gap-6',
      6: 'gap-6 sm:gap-8'
    }
    return sizeMap[size]
  }
}
