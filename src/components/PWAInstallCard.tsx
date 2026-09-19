import React, { useEffect, useState } from 'react'
import { Smartphone, Download, CheckCircle2, Share, PlusSquare } from 'lucide-react'

// Interface for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const PWAInstallCard: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState<boolean>(false)
  const [isIOS, setIsIOS] = useState<boolean>(false)

  useEffect(() => {
    // Check if already installed / running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true
      return isStandaloneMedia || isIOSStandalone
    }

    setIsStandalone(checkStandalone())

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(ios)

    // Capture beforeinstallprompt event (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsStandalone(true)
    }
  }

  if (isStandalone) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid var(--border-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ECFDF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #10B981'
          }}
        >
          <CheckCircle2 size={22} color="#059669" />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Aplicación Instalada
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Estás ejecutando Mi Malla en modo nativo PWA 100% offline.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        border: '1px solid var(--border-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Smartphone size={22} color="var(--color-terracotta)" />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Instalar PWA en el Celular / PC
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Agrega Mi Malla a tu pantalla de inicio para abrirla como una app nativa sin barra de navegador.
          </p>
        </div>
      </div>

      {deferredPrompt ? (
        <button
          onClick={handleInstallClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: 'var(--color-terracotta)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-terracotta)'
          }}
        >
          <Download size={18} />
          Instalar Aplicación Ahora
        </button>
      ) : isIOS ? (
        <div
          style={{
            backgroundColor: 'var(--bg-main)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-terracotta)' }}>
            📱 Instrucciones para iPhone / iPad (Safari):
          </span>
          <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            <li>
              Toca el botón <Share size={13} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> <strong>Compartir</strong> en la barra inferior de Safari.
            </li>
            <li>
              Desplázate hacia abajo y selecciona <PlusSquare size={13} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> <strong>"Agregar a la pantalla de inicio"</strong>.
            </li>
          </ol>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--bg-main)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-terracotta)' }}>
            📱 Cómo instalar en Android / Chrome:
          </span>
          <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            <li>
              Toca el menú de <strong>3 puntos (⋮)</strong> en la esquina superior derecha del navegador.
            </li>
            <li>
              Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
            </li>
          </ol>
        </div>
      )}
    </div>
  )
}
