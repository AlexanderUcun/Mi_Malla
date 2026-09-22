import React from 'react'
import { CheckCheck, FlaskConical } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'
import { CourseCard } from '../components/CourseCard'

export const MallaPage: React.FC = () => {
  const {
    courses,
    selectedPeriod,
    setSelectedPeriod,
    completeSemester,
    isSimulationMode,
    toggleSimulationMode,
    gpaMetrics,
    hideDiagnosticsInMalla
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

  const getCoursesForPeriod = (p: number) =>
    courses
      .filter(c => c.period === p)
      .filter(c => !hideDiagnosticsInMalla || !c.is_diagnostic)
      .sort((a, b) => {
        if (a.is_diagnostic === b.is_diagnostic) return 0
        return a.is_diagnostic ? 1 : -1
      })

  const isPillClickRef = React.useRef(false)
  const pillsContainerRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll active pill horizontally inside pills container ONLY (without jumping the window vertically)
  React.useEffect(() => {
    const pillsContainer = pillsContainerRef.current
    const activePill = document.getElementById(`period-pill-${selectedPeriod}`)
    if (pillsContainer && activePill) {
      const containerRect = pillsContainer.getBoundingClientRect()
      const pillRect = activePill.getBoundingClientRect()
      const targetLeft =
        pillsContainer.scrollLeft +
        (pillRect.left - containerRect.left) -
        containerRect.width / 2 +
        pillRect.width / 2
      pillsContainer.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
    }
  }, [selectedPeriod])

  const handlePeriodPillClick = (periodNum: number) => {
    setSelectedPeriod(periodNum)
    isPillClickRef.current = true
    const container = containerRef.current
    const el = document.getElementById(`period-col-${periodNum}`)
    if (container && el) {
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const targetLeft = container.scrollLeft + (elRect.left - containerRect.left)
      container.scrollTo({ left: targetLeft, behavior: 'smooth' })
      setTimeout(() => {
        isPillClickRef.current = false
      }, 500)
    }
  }

  const scrollTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScroll = () => {
    if (isPillClickRef.current) return
    const container = containerRef.current
    if (!container) return

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      let closestPeriod = 1
      let minDistance = Infinity

      for (const p of periods) {
        const el = document.getElementById(`period-col-${p}`)
        if (el) {
          const elRect = el.getBoundingClientRect()
          const dist = Math.abs(elRect.left - containerRect.left)
          if (dist < minDistance) {
            minDistance = dist
            closestPeriod = p
          }
        }
      }

      if (closestPeriod !== selectedPeriod) {
        setSelectedPeriod(closestPeriod)
      }
    }, 100)
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
      {/* Simulation Banner (only if active) */}
      {isSimulationMode && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            fontSize: '12px',
            color: '#92400E',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FlaskConical size={16} color="#D97706" />
            <span>Modo Simulación Activo ("What-If") — Los cambios no afectan tus datos reales</span>
          </div>
          <button
            onClick={toggleSimulationMode}
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            Salir
          </button>
        </div>
      )}

      {/* Selector Rápido de Semestre (Pills 1 al 9) */}
      <div
        ref={pillsContainerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap', marginRight: '4px' }}>
          Ir a Semestre:
        </span>
        {periods.map(p => (
          <button
            key={p}
            id={`period-pill-${p}`}
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
              transition: 'all 0.2s ease',
              boxShadow: selectedPeriod === p ? 'var(--shadow-terracotta)' : 'none'
            }}
          >
            {p}º
          </button>
        ))}
      </div>

      {/* Grilla Curricular de 9 Semestres con Soporte de Zoom por Gestos (2 dedos / Ctrl+Wheel) */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                    <p style={{ fontSize: isCompact ? '11px' : '12px', color: 'var(--text-secondary)' }}>
                      {totalPeriodCredits} Cr. · {periodCourses.length} Asig.
                    </p>
                    {gpaMetrics?.semesterGPAs[periodNum]?.gpa !== null && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'rgba(115, 72, 47, 0.12)',
                          color: 'var(--color-terracotta)',
                          border: '1px solid rgba(115, 72, 47, 0.25)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Prom: {gpaMetrics.semesterGPAs[periodNum].gpa?.toFixed(2)}
                      </span>
                    )}
                  </div>
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
