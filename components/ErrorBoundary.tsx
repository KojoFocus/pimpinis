'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600 text-sm mt-1">Please try refreshing the page.</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-2">
              <summary className="cursor-pointer text-red-700">Error details</summary>
              <pre className="text-xs text-red-500 mt-1 whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}