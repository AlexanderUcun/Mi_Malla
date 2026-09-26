import React from 'react'
import { CurriculumProvider, useCurriculum } from './context/CurriculumContext'
import { BottomNav } from './components/BottomNav'
import { CourseDrawer } from './components/CourseDrawer'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SkeletonLoader } from './components/SkeletonLoader'
import { UndoToast } from './components/UndoToast'
import { MallaPage } from './pages/MallaPage'
import { LogrosPage } from './pages/LogrosPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SettingsPage } from './pages/SettingsPage'
import { PWAPresentationPage } from './pages/PWAPresentationPage'

const MainContent: React.FC = () => {
  const { activeTab, isHydrating } = useCurriculum()

  if (isHydrating) {
    return <SkeletonLoader />
  }

  return (
    <main style={{ flex: 1, paddingBottom: '96px' }}>
      <ErrorBoundary fallbackMessage="Ocurrió un error al cargar esta sección. Puedes cambiar de pestaña o recargar.">
        {activeTab === 'malla' && <MallaPage />}
        {activeTab === 'logros' && <LogrosPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'settings' && <SettingsPage />}
        {activeTab === 'about' && <PWAPresentationPage />}
      </ErrorBoundary>
    </main>
  )
}

export function App() {
  return (
    <CurriculumProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
        <MainContent />
        <BottomNav />
        <CourseDrawer />
        <UndoToast />
      </div>
    </CurriculumProvider>
  )
}

export default App

