import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'


interface Props {
  children: ReactNode
  fallbackMessage?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in UI Boundary:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            backgroundColor: 'var(--bg-main, #F8F7F4)',
            color: 'var(--text-primary, #232B38)',
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
          role="alert"
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(115, 72, 47, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              color: 'var(--color-terracotta, #73482F)',
            }}
          >
            <AlertTriangle size={32} />
          </div>

          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '8px',
              color: 'var(--text-primary, #232B38)',
            }}
          >
            Algo salió mal en la aplicación
          </h2>

          <p
            style={{
              maxWidth: '480px',
              color: 'var(--text-secondary, #5A6B82)',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              marginBottom: '24px',
            }}
          >
            {this.props.fallbackMessage ||
              'Ha ocurrido un error inesperado al renderizar esta vista. Puedes intentar recargar la aplicación.'}
          </p>

          {this.state.error && (
            <pre
              style={{
                maxWidth: '600px',
                overflowX: 'auto',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-card-muted, #EFECE6)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#b91c1c',
                marginBottom: '24px',
                textAlign: 'left',
                border: '1px solid var(--border-card, rgba(164, 173, 191, 0.4))',
              }}
            >
              {this.state.error.message}
            </pre>
          )}

          <button
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'var(--color-terracotta, #73482F)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(115, 72, 47, 0.2)',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
            }}
          >
            <RefreshCw size={18} />
            Recargar Aplicación
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
