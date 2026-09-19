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

      {/* Grilla Curricular de 9 Semestres con Scroll Snap */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '20px'
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
                minWidth: '320px',
                maxWidth: '350px',
                flex: '0 0 320px',
                scrollSnapAlign: 'start',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                border: '1px solid var(--border-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Header de Columna de Semestre */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border-card)'
                }}
              >
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {periodNum}º Semestre
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {totalPeriodCredits} Créditos · {periodCourses.length} Asignaturas
                  </p>
                </div>

                <button
                  onClick={() => completeSemester(periodNum)}
                  title="Completar todo el semestre en 1 toque"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
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
                  Completar
                </button>
              </div>

              {/* Lista de Tarjetas de Materia */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
