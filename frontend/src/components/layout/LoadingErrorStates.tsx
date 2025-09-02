interface LoadingErrorStatesProps {
  loading: boolean
  error?: string | null
}

export function LoadingErrorStates({ loading, error }: LoadingErrorStatesProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6">
        <p className="text-red-600 text-sm sm:text-base">{error}</p>
      </div>
    )
  }

  return null
}
