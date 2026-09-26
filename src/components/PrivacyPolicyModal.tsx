import React, { useEffect } from 'react'
import { ShieldCheck, Lock, HardDrive, FileText, X } from 'lucide-react'

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(35, 43, 56, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card, #FFFFFF)',
          color: 'var(--text-primary, #232B38)',
          borderRadius: 'var(--radius-lg, 20px)',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid var(--border-card, rgba(164, 173, 191, 0.35))',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2
                id="privacy-modal-title"
                style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)' }}
              >
                Política de Privacidad y Términos de Uso
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#16A34A',
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  marginTop: '4px'
                }}
              >
                100% Local-First & Protegido
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal de privacidad"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary, #5A6B82)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-card, rgba(164, 173, 191, 0.35))' }} />

        {/* Content Section 1: Privacy by Design */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={20} color="var(--color-terracotta, #73482F)" />
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>1. Privacidad por Diseño (Sin Servidores Externos)</h3>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <strong>Mi Malla</strong> opera bajo una arquitectura <em>Local-First</em>. Toda tu información académica,
            incluyendo asignaturas aprobadas, calificaciones opcionales, notas de electivas y puntos de XP acumulados,
            permanece guardada exclusivamente en la base de datos local de tu navegador (<code>IndexedDB</code>).
          </p>
          <ul style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', paddingLeft: '20px' }}>
            <li><strong>Cero Telemetría:</strong> No recolectamos cookies de seguimiento ni datos de navegación.</li>
            <li><strong>Sin Registro Obligatorio:</strong> No solicitamos correo institucional, documento de identidad ni contraseña.</li>
            <li><strong>Sin Transmisión de Datos:</strong> Ningún dato sale de tu dispositivo hacia servidores o terceros.</li>
          </ul>
        </div>

        {/* Content Section 2: Data Sovereignty */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HardDrive size={20} color="var(--color-steel, #6D86A6)" />
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>2. Soberanía y Control Total del Usuario</h3>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            En cumplimiento de los principios generales del <strong>Habeas Data (Ley 1581 de 2012 de Colombia)</strong> y del
            estándar internacional GDPR, tú conservas el dominio absoluto sobre tus datos:
          </p>
          <ul style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', paddingLeft: '20px' }}>
            <li><strong>Exportación Libre:</strong> Puedes descargar un archivo de respaldo <code>.json</code> en 1 clic para transferir tu avance entre dispositivos.</li>
            <li><strong>Derecho al Olvido:</strong> Puedes eliminar la totalidad de tus datos en cualquier momento mediante la opción de <em>Reiniciar Avance</em> en la pestaña de Ajustes.</li>
          </ul>
        </div>

        {/* Content Section 3: Terms & Disclaimer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#D97706" />
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>3. Términos de Uso y Descargo de Responsabilidad</h3>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <strong>Mi Malla</strong> es una herramienta independiente desarrollada para la simulación, planificación y autogestión del plan de estudios universitario.
          </p>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            ⚠️ <strong>Descargo Institucional:</strong> Esta aplicación no reemplaza el Portal Académico ni las plataformas oficiales de registro de la Universidad de Cundinamarca. La validación legal de asignaturas matriculadas, paz y salvos y promedios oficiales se rige exclusivamente por los sistemas institucionales y el Reglamento Estudiantil (REA).
          </p>
        </div>

        {/* Footer button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px',
              backgroundColor: 'var(--color-terracotta, #73482F)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-md, 14px)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
