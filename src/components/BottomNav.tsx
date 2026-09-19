import React from 'react'
import { Map, Trophy, BarChart3, Settings } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useCurriculum()

  return (
    <nav
      className="glass-panel"
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 40,
        padding: '10px 16px',
        paddingBottom: 'var(--safe-bottom)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}
    >
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
  )
}
