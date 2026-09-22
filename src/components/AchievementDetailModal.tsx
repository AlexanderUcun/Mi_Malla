import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Lock, CheckCircle2, CircleDashed } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'
import { getAchievementProgressDetail } from '../lib/gamificationEngine'

interface AchievementDetailModalProps {
  achievementId: string | null
  onClose: () => void
}

export const AchievementDetailModal: React.FC<AchievementDetailModalProps> = ({ achievementId, onClose }) => {
  const { courses, userStatusMap } = useCurriculum()

  const detail = achievementId
    ? getAchievementProgressDetail(achievementId, courses, userStatusMap)
    : null

  return (
    <AnimatePresence>
      {achievementId && detail && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(6px)',
            padding: '20px'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              maxHeight: '85vh',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: detail.isUnlocked ? '2px solid var(--color-terracotta)' : '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: '24px 20px 18px',
                backgroundColor: detail.isUnlocked ? 'var(--bg-card-hover)' : 'var(--bg-main)',
                borderBottom: '1px solid var(--border-card)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    border: detail.isUnlocked ? '2px solid var(--color-terracotta)' : '1px solid var(--border-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {detail.isUnlocked ? (
                    <Trophy size={28} color="var(--color-terracotta)" />
                  ) : (
                    <Lock size={24} color="var(--color-slate-light)" />
                  )}
                </div>

                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: detail.isUnlocked ? 'var(--color-terracotta)' : 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {detail.isUnlocked ? '🏆 Logro Desbloqueado' : '🔒 Requisitos de Desbloqueo'}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {detail.achievement.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: 'var(--text-secondary)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo del Modal con Scroll */}
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {detail.achievement.description}
              </p>

              {/* Barra de Avance Específica del Logro */}
              <div
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  border: '1px solid var(--border-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '12px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Avance de Requisitos</span>
                  <span style={{ fontWeight: 800, color: detail.isUnlocked ? 'var(--color-terracotta)' : 'var(--color-steel)' }}>
                    {detail.totalCompleted} de {detail.totalRequired} {detail.totalRequired === 1 ? 'materia' : 'materias'} ({detail.percentage}%)
                  </span>
                </div>

                <div style={{ height: '8px', backgroundColor: 'var(--bg-card-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${detail.percentage}%`,
                      height: '100%',
                      backgroundColor: detail.isUnlocked ? 'var(--color-terracotta)' : 'var(--color-slate-mid)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>

              {/* Lista de Asignaturas Requeridas */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {detail.totalRequired === 1 && detail.isUnlocked
                    ? 'Asignatura que cumplió el requisito:'
                    : `Asignaturas Requeridas (${detail.totalCompleted}/${detail.totalRequired}):`}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {detail.requiredCourses.map(({ course, isCompleted }) => (
                    <div
                      key={course.code}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isCompleted ? 'rgba(21, 128, 61, 0.12)' : 'var(--bg-main)',
                        border: `1px solid ${isCompleted ? 'rgba(21, 128, 61, 0.35)' : 'var(--border-card)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px'
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{course.name}</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                          Semestre {course.period} · {course.code} ({course.credits} cr)
                        </span>
                      </div>

                      {isCompleted ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontWeight: 700, fontSize: '11px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                          <CheckCircle2 size={15} color="#16A34A" />
                          <span>Aprobada</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                          <CircleDashed size={15} color="var(--color-slate-light)" />
                          <span>Pendiente</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-card)', backgroundColor: 'var(--bg-main)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: 'var(--color-terracotta)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
