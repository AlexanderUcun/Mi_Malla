import React from 'react'
import { Home, Map, Trophy, BarChart3, Settings } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useCurriculum()

  return (
    <nav
      className="glass-panel"
      aria-label="Navegación principal de la aplicación"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingTop: '10px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: '1px solid var(--border-card)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        {/* Item 1: Presentación PWA / Inicio */}
        <button
          onClick={() => setActiveTab('about')}
          aria-label="Ir a la sección de Inicio"
          aria-current={activeTab === 'about' ? 'page' : undefined}
          title="Ver presentación completa de Mi Malla PWA"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'about' ? 'var(--color-terracotta)' : 'var(--color-steel)',
            fontWeight: activeTab === 'about' ? 700 : 500
          }}
        >
          <Home size={19} />
          <span style={{ fontSize: '11px' }}>Inicio</span>
        </button>

        {/* Item 2: Malla */}
        <button
          onClick={() => setActiveTab('malla')}
          aria-label="Ir a la Malla Curricular"
          aria-current={activeTab === 'malla' ? 'page' : undefined}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'malla' ? 'var(--color-terracotta)' : 'var(--color-steel)',
            fontWeight: activeTab === 'malla' ? 700 : 500
          }}
        >
          <Map size={19} />
          <span style={{ fontSize: '11px' }}>Malla</span>
        </button>

        {/* Item 3: Logros */}
        <button
          onClick={() => setActiveTab('logros')}
          aria-label="Ir a la Vitrina de Logros"
          aria-current={activeTab === 'logros' ? 'page' : undefined}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'logros' ? 'var(--color-terracotta)' : 'var(--color-steel)',
            fontWeight: activeTab === 'logros' ? 700 : 500
          }}
        >
          <Trophy size={19} />
          <span style={{ fontSize: '11px' }}>Logros</span>
        </button>

        {/* Item 4: Métricas */}
        <button
          onClick={() => setActiveTab('analytics')}
          aria-label="Ir a Métricas y Analíticas"
          aria-current={activeTab === 'analytics' ? 'page' : undefined}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'analytics' ? 'var(--color-terracotta)' : 'var(--color-steel)',
            fontWeight: activeTab === 'analytics' ? 700 : 500
          }}
        >
          <BarChart3 size={19} />
          <span style={{ fontSize: '11px' }}>Métricas</span>
        </button>

        {/* Item 5: Ajustes */}
        <button
          onClick={() => setActiveTab('settings')}
          aria-label="Ir a Configuración y Ajustes"
          aria-current={activeTab === 'settings' ? 'page' : undefined}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'settings' ? 'var(--color-terracotta)' : 'var(--color-steel)',
            fontWeight: activeTab === 'settings' ? 700 : 500
          }}
        >
          <Settings size={19} />
          <span style={{ fontSize: '11px' }}>Ajustes</span>
        </button>
      </div>
    </nav>

  )
}
