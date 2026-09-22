import React, { useRef, useState } from 'react'
import { Download, Upload, FlaskConical, Moon, Sun, Share2, Sparkles } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'
import { exportProgressJSON, bulkSaveCourseStatuses } from '../lib/db'
import { ZUserProgressImport, type UserCourseRecord } from '../types/curriculum'
import { ShareCardModal } from '../components/ShareCardModal'
import { PWAInstallCard } from '../components/PWAInstallCard'

export const SettingsPage: React.FC = () => {
  const {
    theme,
    toggleTheme,
    isSimulationMode,
    toggleSimulationMode,
    resetProgress,
    levelInfo,
    metrics,
    includeDiagnosticsInGPA,
    toggleIncludeDiagnosticsInGPA
  } = useCurriculum()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false)
  const [showShareModal, setShowShareModal] = useState<boolean>(false)

  const handleExportJSON = async () => {
    try {
      const data = await exportProgressJSON('Administración de Empresas')
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mi_malla_backup_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error al exportar respaldo:', err)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const json = JSON.parse(text)
      
      // Strict Zod Validation before touching Dexie.js
      const validatedData = ZUserProgressImport.parse(json)
      
      await bulkSaveCourseStatuses(validatedData.records as UserCourseRecord[])
      setImportStatus('✅ Progreso importado con éxito.')
      setTimeout(() => setImportStatus(null), 4000)
    } catch (err) {
      console.error('Error de validación al importar:', err)
      setImportStatus('❌ Error: El archivo de respaldo está malformado o no es válido.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Perfil, Respaldos & Simulación</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Gestiona tus datos 100% offline, experimenta con escenarios simulados o transfiere tu progreso.
        </p>
      </div>

      {/* PWA Direct Installation Card */}
      <PWAInstallCard />

      {/* Ficha de Personaje Compartible */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: '#FDF0EC', border: '1px solid var(--color-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} color="var(--color-terracotta)" />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Ficha de Avance Compartible</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Genera tu tarjeta de personaje RPG con tu nivel ({levelInfo.title}) y porcentaje ({Math.round(metrics.completionPercentage)}%).
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowShareModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            backgroundColor: 'var(--color-terracotta)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          <Share2 size={16} />
          Ver Ficha
        </button>
      </div>

      <ShareCardModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlaskConical size={20} color="#D97706" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Modo Simulación ("What-If")</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Prueba marcar materias para planificar semestres futuros sin alterar tus datos reales.
              </p>
            </div>
          </div>

          <button
            onClick={toggleSimulationMode}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: isSimulationMode ? '2px solid #D97706' : '1px solid var(--border-card)',
              backgroundColor: isSimulationMode ? '#FEF3C7' : 'var(--bg-main)',
              color: isSimulationMode ? '#92400E' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {isSimulationMode ? 'Simulación Activa' : 'Activar Simulación'}
          </button>
        </div>
      </div>

      {/* Exportar e Importar Progreso */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Copia de Seguridad y Portabilidad (100% Offline)</h3>
        
        {importStatus && (
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-card-muted)', fontSize: '13px', fontWeight: 600 }}>
            {importStatus}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={handleExportJSON}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--color-terracotta)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Download size={16} />
            Exportar Progreso (.json)
          </button>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Upload size={16} />
            Importar Progreso (.json)
          </button>
        </div>
      </div>


      {/* Configuración de Promedio y Diagnósticos */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Sumar Notas de Diagnósticos al Promedio</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Si se activa, los diagnósticos con nota sumarán al promedio sin alterar los créditos totales (0 cr) de la carrera.
          </p>
        </div>

        <button
          onClick={toggleIncludeDiagnosticsInGPA}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: includeDiagnosticsInGPA ? '2px solid var(--color-terracotta)' : '1px solid var(--border-card)',
            backgroundColor: includeDiagnosticsInGPA ? '#FDF0EC' : 'var(--bg-main)',
            color: includeDiagnosticsInGPA ? 'var(--color-terracotta)' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          {includeDiagnosticsInGPA ? '✓ Activado' : 'Desactivado'}
        </button>
      </div>

      {/* Selector de Tema */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Apariencia de Interfaz</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Alternar entre Modo Claro (Warm & Clean) y Modo Oscuro.
          </p>
        </div>

        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-card)',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} color="var(--color-sand)" />}
          {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
        </button>
      </div>

      {/* Zona de Peligro: Reiniciar Avance */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid #FCA5A5' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#DC2626' }}>Reiniciar Avance Académico</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '16px' }}>
          Esta acción desmarcará todas las materias aprobadas y restablecerá los puntos de XP a cero.
        </p>

        {showResetConfirm ? (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626' }}>¿Confirmas reiniciar todo?</span>
            <button
              onClick={async () => {
                await resetProgress()
                setShowResetConfirm(false)
              }}
              style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
            >
              Sí, reiniciar
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)', backgroundColor: 'var(--bg-main)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #FCA5A5',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Reiniciar Avance
          </button>
        )}
      </div>
    </div>
  )
}
