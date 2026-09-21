import React from 'react'
import { CheckCheck, RotateCcw } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'
import { CourseCard } from '../components/CourseCard'

export const MallaPage: React.FC = () => {
  const {
    courses,
    selectedPeriod,
    setSelectedPeriod,
    completeSemester,
    undoState,
    undoLastAction,
    clearUndo
  } = useCurriculum()

  // Zoom Level State (range 0.6x to 1.25x)
  const [zoomScale, setZoomScale] = React.useState<number>(1.0)
  const zoomScaleRef = React.useRef<number>(1.0)
  zoomScaleRef.current = zoomScale

  const containerRef = React.useRef<HTMLDivElement>(null)
  const touchStateRef = React.useRef<{
    initialDist: number
    initialZoom: number
    lastDoubleTapTime: number
  }>({
    initialDist: 0,
    initialZoom: 1.0,
    lastDoubleTapTime: 0
  })

  // Group courses by period 1..9
  const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  const getCoursesForPeriod = (p: number) => courses.filter(c => c.period === p)

  const handlePeriodPillClick = (periodNum: number) => {
    setSelectedPeriod(periodNum)
    const el = document.getElementById(`period-col-${periodNum}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }

  // Registrar listeners nativos con passive: false para que e.preventDefault() funcione correctamente
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheelNative = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const delta = -e.deltaY * 0.002
        setZoomScale(prev => Math.min(1.25, Math.max(0.6, prev + delta)))
      }
    }

    const handleTouchMoveNative = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStateRef.current.initialDist > 0) {
        e.preventDefault() // Previene el zoom nativo del navegador durante el pinch
        const t1 = e.touches[0]
        const t2 = e.touches[1]
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
        const factor = dist / touchStateRef.current.initialDist
        const newZoom = Math.min(1.25, Math.max(0.6, touchStateRef.current.initialZoom * factor))
        setZoomScale(newZoom)
      }
    }

    container.addEventListener('wheel', handleWheelNative, { passive: false })
    container.addEventListener('touchmove', handleTouchMoveNative, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheelNative)
      container.removeEventListener('touchmove', handleTouchMoveNative)
    }
  }, [])

  // Gesto táctil de 2 dedos (Pinch-to-Zoom & Double-Tap Reset)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0]
      const t2 = e.touches[1]
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
      
      const now = Date.now()
      if (now - touchStateRef.current.lastDoubleTapTime < 300) {
        // Reset Zoom al 100% con doble toque rápido de 2 dedos
        setZoomScale(1.0)
      }
      touchStateRef.current.lastDoubleTapTime = now

      touchStateRef.current.initialDist = dist
      touchStateRef.current.initialZoom = zoomScaleRef.current
    }
  }

  const handleTouchEnd = () => {
    touchStateRef.current.initialDist = 0
  }

  // Ancho dinámico de columna según el nivel de Zoom
  const colWidth = Math.round(320 * zoomScale)
  const isCompact = zoomScale < 0.85

  return (
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Undo Toast Notification */}
      {undoState && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            backgroundColor: 'var(--text-primary)',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '13px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <span>Estado de asignatura actualizado</span>
          <button
            onClick={undoLastAction}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-sand)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={14} /> Deshacer
          </button>
          <button
            onClick={clearUndo}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', marginLeft: '4px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Selector Rápido de Semestre (Pills 1 al 9) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap', marginRight: '4px' }}>
          Ir a Semestre:
        </span>
        {periods.map(p => (
          <button
            key={p}
            onClick={() => handlePeriodPillClick(p)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: selectedPeriod === p ? '2px solid var(--color-terracotta)' : '1px solid var(--border-card)',
              backgroundColor: selectedPeriod === p ? 'var(--color-terracotta)' : 'var(--bg-card)',
              color: selectedPeriod === p ? '#FFFFFF' : 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {p}º
          </button>
        ))}
      </div>

      {/* Grilla Curricular de 9 Semestres con Soporte de Zoom por Gestos (2 dedos / Ctrl+Wheel) */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          display: 'flex',
          gap: `${Math.max(10, Math.round(20 * zoomScale))}px`,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '20px',
          touchAction: 'pan-x pan-y',
          userSelect: 'none'
        }}
      >
        {periods.map(periodNum => {
          const periodCourses = getCoursesForPeriod(periodNum)
          const totalPeriodCredits = periodCourses.reduce((sum, c) => sum + c.credits, 0)

          return (
            <div
              key={periodNum}
              id={`period-col-${periodNum}`}
              style={{
                minWidth: `${colWidth}px`,
                maxWidth: `${Math.round(colWidth * 1.1)}px`,
                flex: `0 0 ${colWidth}px`,
                scrollSnapAlign: 'start',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: isCompact ? '12px 14px' : '20px',
                border: '1px solid var(--border-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: isCompact ? '10px' : '16px',
                transition: 'min-width 0.1s ease, flex 0.1s ease, padding 0.1s ease'
              }}
            >
              {/* Header de Columna de Semestre */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: isCompact ? '8px' : '12px',
                  borderBottom: '1px solid var(--border-card)'
                }}
              >
                <div>
                  <h2 style={{ fontSize: isCompact ? '15px' : '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {periodNum}º Semestre
                  </h2>
                  <p style={{ fontSize: isCompact ? '11px' : '12px', color: 'var(--text-secondary)' }}>
                    {totalPeriodCredits} Cr. · {periodCourses.length} Asig.
                  </p>
                </div>

                <button
                  onClick={() => completeSemester(periodNum)}
                  title="Completar todo el semestre en 1 toque"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: isCompact ? '3px 6px' : '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-card)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--color-steel)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <CheckCheck size={14} color="var(--color-steel)" />
                  {!isCompact && 'Completar'}
                </button>
              </div>

              {/* Lista de Tarjetas de Materia */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: isCompact ? '8px' : '12px' }}>
                {periodCourses.map(course => (
                  <CourseCard key={course.code} course={course} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
