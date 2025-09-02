interface MobileQuickActionsProps {
  onQuickCreate: () => void
  onRefresh: () => void
  onViewStats: () => void
}

export function MobileQuickActions({ onQuickCreate, onRefresh, onViewStats }: MobileQuickActionsProps) {
  return (
    <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
        <div className="flex items-center justify-around">
          <button
            onClick={onQuickCreate}
            className="flex flex-col items-center p-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
            title="Quick Create"
            aria-label="Quick Create Ticket"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">Create</span>
          </button>
          
          <button
            onClick={onRefresh}
            className="flex flex-col items-center p-2 text-green-600 hover:text-green-700 transition-colors duration-200"
            title="Refresh"
            aria-label="Refresh Data"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-xs">Refresh</span>
          </button>
          
          <button
            onClick={onViewStats}
            className="flex flex-col items-center p-2 text-purple-600 hover:text-purple-700 transition-colors duration-200"
            title="Stats"
            aria-label="View Statistics"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Stats</span>
          </button>
        </div>
      </div>
    </div>
  )
}
