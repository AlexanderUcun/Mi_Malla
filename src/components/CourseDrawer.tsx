import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, CheckCircle2, Zap, Swords, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'
import { getCourse, getPrerequisites, getUnlockedTargetCourses } from '../lib/curriculumEngine'
import type { CourseStatusType } from '../types/curriculum'

interface FormInputs {
  custom_name: string
  grade: string
}

export const CourseDrawer: React.FC = () => {
  const {
    inspectedCourseCode,
    setInspectedCourseCode,
    computedStateMap,
    userStatusMap,
    customNamesMap,
    gradesMap,
    setCourseStatus,
    setCourseExtras
  } = useCurriculum()

  const course = inspectedCourseCode ? getCourse(inspectedCourseCode) : undefined
  const state = course ? (computedStateMap.get(course.code) || 'locked') : 'locked'

  const prereqs = course ? getPrerequisites(course.code) : []
  const targets = course ? getUnlockedTargetCourses(course.code) : []

  const { register, handleSubmit, reset } = useForm<FormInputs>()

  useEffect(() => {
    if (course) {
      reset({
        custom_name: customNamesMap.get(course.code) || '',
        grade: gradesMap.get(course.code)?.toString() || ''
      })
    }
  }, [course, inspectedCourseCode, customNamesMap, gradesMap, reset])

  if (!course) return null

  const onSubmit = async (data: FormInputs) => {
    const gradeNum = data.grade ? parseFloat(data.grade) : undefined
    await setCourseExtras(course.code, {
      custom_name: data.custom_name.trim() || undefined,
      grade: gradeNum
    })
    setInspectedCourseCode(null)
  }

  const handleStatusChange = async (newStatus: CourseStatusType) => {
    await setCourseStatus(course.code, newStatus)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={() => setInspectedCourseCode(null)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-steel)', textTransform: 'uppercase' }}>
              Semestre {course.period} · {course.code}
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>
              {customNamesMap.get(course.code) || course.name}
            </h2>
          </div>
          <button
            onClick={() => setInspectedCourseCode(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Course Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Créditos</span>
            <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{course.credits}</strong>
          </div>
          <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Horas Teóricas</span>
            <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{course.ht}h</strong>
          </div>
          <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Categoría</span>
            <strong style={{ fontSize: '12px', color: 'var(--text-terracotta)', textTransform: 'capitalize' }}>{course.category}</strong>
          </div>
        </div>

        {/* State Switcher Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Estado de Asignatura:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={state === 'locked'}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: state === 'completed' ? 'var(--color-terracotta)' : 'var(--bg-main)',
                color: state === 'completed' ? '#FFFFFF' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: state === 'locked' ? 'not-allowed' : 'pointer',
                opacity: state === 'locked' ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={16} /> Aprobada
            </button>

            <button
              onClick={() => handleStatusChange('in_progress')}
              disabled={state === 'locked'}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: state === 'in_progress' ? 'var(--color-slate-mid)' : 'var(--bg-main)',
                color: state === 'in_progress' ? '#FFFFFF' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: state === 'locked' ? 'not-allowed' : 'pointer',
                opacity: state === 'locked' ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Swords size={16} /> En Curso
            </button>

            <button
              onClick={() => handleStatusChange('pending')}
              disabled={state === 'locked'}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: state === 'unlocked' ? 'var(--bg-card-muted)' : 'var(--bg-main)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: state === 'locked' ? 'not-allowed' : 'pointer',
                opacity: state === 'locked' ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Zap size={16} /> Pendiente
            </button>

            <button
              onClick={() => handleStatusChange('failed')}
              disabled={state === 'locked'}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: state === 'failed' ? '#FEE2E2' : 'var(--bg-main)',
                color: state === 'failed' ? '#DC2626' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: state === 'locked' ? 'not-allowed' : 'pointer',
                opacity: state === 'locked' ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <AlertCircle size={16} /> Por Nivelar
            </button>
          </div>
        </div>

        {/* Chain Analysis: Prereqs & Unlocks */}
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ArrowLeft size={14} /> Requisitos Previos Requeridos:
            </h4>
            {prereqs.length === 0 ? (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ninguno (Ingreso directo)</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {prereqs.map(p => {
                  const pDone = userStatusMap.get(p.code) === 'completed'
                  return (
                    <div key={p.code} style={{ fontSize: '12px', padding: '6px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: pDone ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${pDone ? '#BBF7D0' : '#FECACA'}`, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{p.name} ({p.code})</span>
                      <strong style={{ color: pDone ? '#166534' : '#991B1B' }}>{pDone ? '✓ Cumplido' : 'Pendiente'}</strong>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ArrowRight size={14} /> Asignaturas que Desbloquea a Futuro:
            </h4>
            {targets.length === 0 ? (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ninguna (Asignatura terminal)</span>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {targets.map(t => (
                  <span key={t.code} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-card)' }}>
                    {t.name} (Sem {t.period})
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Custom Form for Electives & Grade */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 'auto', borderTop: '1px solid var(--border-card)', paddingTop: '16px' }}>
          {course.is_elective && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                Nombre Personalizado de Electiva:
              </label>
              <input
                {...register('custom_name')}
                placeholder="Ej. Comercio Electrónico"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-card)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Nota / Calificación Referencial (Opcional 0.0 - 5.0):
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...register('grade')}
              placeholder="Ej. 4.5"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-card)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--color-terracotta)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  )
}
