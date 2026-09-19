import React from 'react'
import { CheckCircle2, Lock, Zap, Swords, AlertCircle, Edit3 } from 'lucide-react'
import type { Course } from '../types/curriculum'
import { useCurriculum } from '../context/CurriculumContext'

interface CourseCardProps {
  course: Course
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const {
    computedStateMap,
    customNamesMap,
    toggleCourseStatus,
    setInspectedCourseCode
  } = useCurriculum()

  const state = computedStateMap.get(course.code) || 'locked'
  const customName = customNamesMap.get(course.code)
  const displayName = customName || course.name

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInspectedCourseCode(course.code)
  }

  const handleToggleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (state === 'locked') return

    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(15)
      } catch {
        // ignore if not supported
      }
    }
    await toggleCourseStatus(course.code)
  }

  // Dynamic Styles per State
  let bg = 'var(--node-unlocked-bg)'
  let borderColor = 'var(--node-unlocked-border)'
  let shadow = 'var(--shadow-sm)'
  let opacity = 1

  if (state === 'locked') {
    bg = 'var(--node-locked-bg)'
    borderColor = 'var(--node-locked-border)'
    opacity = 0.75
  } else if (state === 'in_progress') {
    bg = 'var(--node-progress-bg)'
    borderColor = 'var(--node-progress-border)'
    shadow = 'var(--shadow-md)'
  } else if (state === 'completed') {
    bg = 'var(--node-completed-bg)'
    borderColor = 'var(--node-completed-border)'
    shadow = 'var(--shadow-terracotta)'
  } else if (state === 'failed') {
    bg = 'var(--node-failed-bg)'
    borderColor = 'var(--node-failed-border)'
  }

  return (
    <div
      onClick={handleCardClick}
      className="transition-all"
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: bg,
        border: `2px solid ${borderColor}`,
        boxShadow: shadow,
        opacity,
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '10px',
        minHeight: '145px'
      }}
    >
      {/* Top Header: Category Badge & Credits */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {course.is_diagnostic ? (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                border: '1px solid #FCD34D'
              }}
            >
              Diagnóstico
            </span>
          ) : course.category === 'general_education' ? (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-card-muted)',
                color: 'var(--color-steel)'
              }}
            >
              Formación General
            </span>
          ) : course.category === 'specialization' ? (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FDF0EC',
                color: 'var(--color-terracotta)'
              }}
            >
              Énfasis (8 cr)
            </span>
          ) : course.category === 'elective' ? (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#EFF6FF',
                color: '#2563EB'
              }}
            >
              Electiva
            </span>
          ) : null}

          {course.learning_field && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-card-muted)',
                color: 'var(--text-secondary)'
              }}
            >
              {course.learning_field}
            </span>
          )}
        </div>

        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: state === 'completed' ? 'var(--color-terracotta)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap'
          }}
        >
          {course.credits > 0 ? `${course.credits} cr` : '0 cr'}
        </span>
      </div>

      {/* Course Title & Code */}
      <div>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 700,
            lineHeight: 1.3,
            color: state === 'locked' ? 'var(--text-secondary)' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {displayName}
          {customName && <Edit3 size={12} color="var(--color-steel)" />}
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {course.code} {course.ht > 0 ? `· HT: ${course.ht}h` : ''}
        </p>
      </div>

      {/* Footer State & Action Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        {state === 'completed' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--color-terracotta)' }}>
            <CheckCircle2 size={14} color="var(--color-terracotta)" />
            <span>Aprobada ({course.credits * 100} XP)</span>
          </div>
        ) : state === 'in_progress' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--color-slate-mid)' }}>
            <Swords size={14} color="var(--color-slate-mid)" />
            <span>En curso</span>
          </div>
        ) : state === 'unlocked' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--color-steel)' }}>
            <Zap size={14} color="var(--color-steel)" />
            <span>Disponible</span>
          </div>
        ) : state === 'failed' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#E53E3E' }}>
            <AlertCircle size={14} color="#E53E3E" />
            <span>Por nivelar</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <Lock size={13} color="var(--color-slate-light)" />
            <span>Bloqueada</span>
          </div>
        )}

        {/* Action Button */}
        {state !== 'locked' && (
          <button
            onClick={handleToggleClick}
            title={state === 'completed' ? 'Marcar como pendiente' : 'Marcar como aprobada'}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: state === 'completed' ? 'var(--bg-card-muted)' : 'var(--color-terracotta)',
              color: state === 'completed' ? 'var(--text-primary)' : '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {state === 'completed' ? 'Desmarcar' : 'Aprobar'}
          </button>
        )}
      </div>
    </div>
  )
}
