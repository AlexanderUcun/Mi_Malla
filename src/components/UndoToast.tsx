import React, { useEffect } from 'react'
import { RotateCcw, X } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'

export const UndoToast: React.FC = () => {
  const { undoState, undoLastAction, clearUndo, courses } = useCurriculum()

  useEffect(() => {
    if (!undoState) return

    const timer = setTimeout(() => {
      clearUndo()
    }, 6000)

    return () => clearTimeout(timer)
  }, [undoState, clearUndo])

  if (!undoState) return null

  const course = courses.find((c) => c.code === undoState.code)
  const courseName = course ? course.name : undoState.code

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        backgroundColor: '#232B38',
        color: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        fontSize: '0.9rem',
        maxWidth: '90vw',
        animation: 'fadeInUp 0.25s ease-out forwards',
      }}
    >
      <span style={{ color: '#D9D3C7' }}>
        Estado actualizado de <strong>{courseName}</strong>
      </span>
      <button
        onClick={() => {
          undoLastAction()
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: '#73482F',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        aria-label={`Deshacer cambio de estado de ${courseName}`}
      >
        <RotateCcw size={14} />
        Deshacer
      </button>
      <button
        onClick={clearUndo}
        style={{
          background: 'none',
          border: 'none',
          color: '#A4ADBF',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  )
}
