import { useState } from 'react'
import { Sparkles, Trophy, Map, BarChart3, Settings, Moon, Sun, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [activeTab, setActiveTab] = useState<'malla' | 'logros' | 'analytics' | 'settings'>('malla')

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      {/* Header Superior con Barra de XP e Identidad Visual */}
      <header style={{
        padding: '16px 24px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            border: '1px solid var(--border-card)'
          }}>
            <img src="/logo.svg" alt="Mi Malla Logo" style={{ width: '100%', height: '100%' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Mi Malla <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-card-muted)', color: 'var(--text-terracotta)', marginLeft: '6px' }}>v1.0 PWA</span>
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Administración de Empresas · UDEC Chía</p>
          </div>
        </div>

        {/* Nivel RPG y Barra de XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--color-terracotta)" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-terracotta)' }}>Nivel 1: Recluta Universitario</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>(0 / 15,800 XP)</span>
            </div>
            <div style={{
              width: '180px',
              height: '8px',
              backgroundColor: 'var(--bg-card-muted)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '5%',
                height: '100%',
                backgroundColor: 'var(--color-terracotta)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Alternar Tema"
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

      {/* Contenido Principal de Demostración Fase 1 */}
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <ShieldCheck size={24} color="var(--color-terracotta)" />
            <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Fase 1: Cimientos del Proyecto e Identidad Visual</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '15px' }}>
            La aplicación ha sido inicializada exitosamente con <strong>Vite + React + TypeScript</strong>, sistema de diseño en <strong>Modo Claro Warm & Clean</strong>, infraestructura para Modo Oscuro, tipografías (Outfit & Inter), soporte PWA e ícono vectorial oficial.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* Tarjeta de demostración de estados RPG */}
            <div style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--node-unlocked-bg)',
              border: '2px solid var(--node-unlocked-border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Semestre 1</span>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-card-muted)', color: 'var(--color-steel)' }}>4 Créditos</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Contabilidad General</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>CAD102020104 · Contabilidad y Costos</p>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--color-steel)' }}>
                <Zap size={14} color="var(--color-steel)" /> Lista para cursar (Desbloqueada)
              </div>
            </div>

            <div style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--node-completed-bg)',
              border: '2px solid var(--node-completed-border)',
              boxShadow: 'var(--shadow-terracotta)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-terracotta)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Semestre 1</span>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: '#FDF0EC', color: 'var(--color-terracotta)' }}>3 Créditos · 300 XP</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Fundamentos de Administración</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>CAD102020103 · Estrategia y Gerencia</p>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--color-terracotta)' }}>
                <CheckCircle2 size={14} color="var(--color-terracotta)" /> Habilidad Dominada (Aprobada)
              </div>
            </div>

            <div style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--node-locked-bg)',
              border: '1px solid var(--node-locked-border)',
              opacity: 0.85
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Semestre 2</span>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)' }}>4 Créditos</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Costos y Presupuesto</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>CAD102020209 · Contabilidad y Costos</p>
              <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                🔒 Requisito: Contabilidad General
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation Bar Inferior Móvil (Bottom Nav) con Glassmorphism */}
      <nav className="glass-panel" style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 40,
        padding: '10px 16px',
        paddingBottom: 'var(--safe-bottom)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setActiveTab('malla')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'malla' ? 'var(--color-terracotta)' : 'var(--color-steel)',
            fontWeight: activeTab === 'malla' ? 700 : 500
          }}
        >
          <Map size={20} />
          <span style={{ fontSize: '11px' }}>Malla</span>
        </button>

        <button
          onClick={() => setActiveTab('logros')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'logros' ? 'var(--color-terracotta)' : 'var(--color-steel)',
            fontWeight: activeTab === 'logros' ? 700 : 500
          }}
        >
          <Trophy size={20} />
          <span style={{ fontSize: '11px' }}>Logros</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'analytics' ? 'var(--color-terracotta)' : 'var(--color-steel)',
            fontWeight: activeTab === 'analytics' ? 700 : 500
          }}
        >
          <BarChart3 size={20} />
          <span style={{ fontSize: '11px' }}>Métricas</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'settings' ? 'var(--color-terracotta)' : 'var(--color-steel)',
            fontWeight: activeTab === 'settings' ? 700 : 500
          }}
        >
          <Settings size={20} />
          <span style={{ fontSize: '11px' }}>Ajustes</span>
        </button>
      </nav>
    </div>
  )
}

export default App
