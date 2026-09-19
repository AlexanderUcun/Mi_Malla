import React from 'react'
import { Trophy, Award, Lock, CheckCircle2 } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'
import { ACHIEVEMENTS_CATALOG } from '../lib/gamificationEngine'

export const LogrosPage: React.FC = () => {
  const { levelInfo, unlockedAchievements, totalXP } = useCurriculum()

  const unlockedIds = new Set(unlockedAchievements.map(a => a.id))

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner de Rango del Estudiante */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FDF0EC',
              border: '2px solid var(--color-terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trophy size={32} color="var(--color-terracotta)" />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-terracotta)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Rango Actual · Nivel {levelInfo.level}
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {levelInfo.title}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {totalXP.toLocaleString()} / 15,800 XP acumulados
            </p>
          </div>
        </div>

        <div style={{ minWidth: '220px', flex: '1 1 220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Progreso de Nivel</span>
            <span style={{ color: 'var(--color-terracotta)' }}>{Math.round(levelInfo.progressPercentage)}%</span>
          </div>
          <div style={{ height: '10px', backgroundColor: 'var(--bg-card-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${levelInfo.progressPercentage}%`,
                height: '100%',
                backgroundColor: 'var(--color-terracotta)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Seccion Galeria de Logros */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Vitrina de Logros & Medallas</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Desbloqueados: {unlockedAchievements.length} de {ACHIEVEMENTS_CATALOG.length}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {ACHIEVEMENTS_CATALOG.map(ach => {
            const isUnlocked = unlockedIds.has(ach.id)

            return (
              <div
                key={ach.id}
                className="transition-all"
                style={{
                  backgroundColor: isUnlocked ? 'var(--bg-card)' : 'var(--node-locked-bg)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  border: isUnlocked ? '2px solid var(--color-terracotta)' : '1px solid var(--border-card)',
                  boxShadow: isUnlocked ? 'var(--shadow-terracotta)' : 'none',
                  opacity: isUnlocked ? 1 : 0.75,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isUnlocked ? '#FDF0EC' : 'var(--bg-main)',
                    border: isUnlocked ? '1px solid var(--color-terracotta)' : '1px solid var(--border-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isUnlocked ? (
                    <Award size={24} color="var(--color-terracotta)" />
                  ) : (
                    <Lock size={20} color="var(--color-slate-light)" />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {ach.title}
                    </h4>
                    {isUnlocked && <CheckCircle2 size={16} color="var(--color-terracotta)" />}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {ach.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
