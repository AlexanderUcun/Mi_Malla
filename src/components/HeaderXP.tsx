import React from 'react'
import { Sparkles, Moon, Sun, FlaskConical, ShieldAlert } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'

export const HeaderXP: React.FC = () => {
  const { levelInfo, theme, toggleTheme, isSimulationMode, toggleSimulationMode, gpaMetrics } = useCurriculum()

  return (
    <header
      style={{
        padding: '14px 20px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            border: '1px solid var(--border-card)'
          }}
        >
          <img src="./logo.svg" alt="Mi Malla Logo" style={{ width: '100%', height: '100%' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Mi Malla
            </h1>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-card-muted)',
                color: 'var(--text-terracotta)'
              }}
            >
              PWA
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Administración de Empresas · UDEC</p>
        </div>
      </div>

      {/* Simulation Badge & XP Progress Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {gpaMetrics?.cumulativeGPA !== null && gpaMetrics.cumulativeGPA < 3.2 && (
          <div
            title="Tu promedio acumulado está por debajo del límite de permanencia de 3.2 (Reglamento Estudiantil)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#DC2626',
              fontSize: '11px',
              fontWeight: 700
            }}
          >
            <ShieldAlert size={14} color="#DC2626" />
            <span>Riesgo (Prom. &lt; 3.2)</span>
          </div>
        )}

        {isSimulationMode && (
          <button
            onClick={toggleSimulationMode}
            title="Desactivar Modo Simulación"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#FEF3C7',
              border: '1px solid #F59E0B',
              color: '#92400E',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <FlaskConical size={14} color="#D97706" />
            Simulación Activa
          </button>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--color-terracotta)" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-terracotta)' }}>
              Nivel {levelInfo.level}: {levelInfo.title}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              ({levelInfo.currentXP.toLocaleString()} / 15,800 XP)
            </span>
          </div>

          <div
            style={{
              width: '160px',
              height: '8px',
              backgroundColor: 'var(--bg-card-muted)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}
          >
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

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Alternar Tema Claro/Oscuro"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-card)',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="var(--color-sand)" />}
        </button>
      </div>
    </header>
  )
}
