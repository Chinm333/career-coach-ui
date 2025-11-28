import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 font-semibold">Chart could not be displayed.</p>
          <p className="text-red-600 text-sm mt-1">Please refresh the page or try again later.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

