import React from 'react'
import { CurriculumProvider, useCurriculum } from './context/CurriculumContext'
import { HeaderXP } from './components/HeaderXP'
import { BottomNav } from './components/BottomNav'
import { CourseDrawer } from './components/CourseDrawer'
import { MallaPage } from './pages/MallaPage'
import { LogrosPage } from './pages/LogrosPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SettingsPage } from './pages/SettingsPage'

const MainContent: React.FC = () => {
  const { activeTab, isHydrating } = useCurriculum()

  if (isHydrating) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              animation: 'pulse 1.5s infinite'
            }}
          >
            <img src="/logo.svg" alt="Loading logo" style={{ width: '36px', height: '36px' }} />
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Cargando Mi Malla...</p>
        </div>
      </div>
    )
  }

  return (
    <main style={{ flex: 1, paddingBottom: '24px' }}>
      {activeTab === 'malla' && <MallaPage />}
      {activeTab === 'logros' && <LogrosPage />}
      {activeTab === 'analytics' && <AnalyticsPage />}
      {activeTab === 'settings' && <SettingsPage />}
    </main>
  )
}

export function App() {
  return (
    <CurriculumProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
        <HeaderXP />
        <MainContent />
        <BottomNav />
        <CourseDrawer />
      </div>
    </CurriculumProvider>
  )
}

export default App
