import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ShieldCheck, Cpu, Database, Award } from 'lucide-react'

interface PWAPresentationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PWAPresentationModal: React.FC<PWAPresentationModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(6px)',
            padding: '20px'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header decorativo con gradiente suave */}
            <div
              style={{
                padding: '28px 24px 20px',
                background: 'linear-gradient(135deg, #FDF0EC 0%, #F8F7F4 100%)',
                borderBottom: '1px solid var(--border-card)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>

              {/* Logo Animado con Framer Motion */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  scale: [1, 1.04, 1]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px',
                  boxShadow: '0 8px 24px rgba(115, 72, 47, 0.15)',
                  border: '2px solid var(--color-terracotta)',
                  marginBottom: '14px'
                }}
              >
                <img src="./logo.svg" alt="Mi Malla PWA Logo" style={{ width: '100%', height: '100%' }} />
              </motion.div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Mi Malla
                </h2>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-terracotta)',
                    color: '#FFFFFF'
                  }}
                >
                  PWA
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'center', fontWeight: 500 }}>
                Rastreador de Malla Curricular · Universidad de Cundinamarca
              </p>
            </div>

            {/* Contenido Ficha Técnica */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Grid de Métricas Clave */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <div style={{ padding: '10px 4px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Períodos</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>9 Sem.</strong>
                </div>
                <div style={{ padding: '10px 4px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Créditos</span>
                  <strong style={{ fontSize: '14px', color: 'var(--color-terracotta)' }}>158 Cr.</strong>
                </div>
                <div style={{ padding: '10px 4px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Materias</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>66 Asig.</strong>
                </div>
                <div style={{ padding: '10px 4px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Sede</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Chía</strong>
                </div>
              </div>

              {/* Lista de Características Clave */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <ShieldCheck size={18} color="var(--color-terracotta)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>100% Offline & Local-First</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Funciona sin internet mediante Dexie.js (IndexedDB). Tus notas y avances jamás salen de tu dispositivo.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Cpu size={18} color="var(--color-steel)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>Grafo de Prerrequisitos Interactivo</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Cadena de resplandor (Chain Glow) que resalta asignaturas requeridas y materias que desbloqueas a futuro.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Award size={18} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>Motor de Gamificación RPG</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      1 Crédito = 100 XP. Desbloquea medallas de logros, sube de nivel y genera tu Ficha de Personaje compartible.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Database size={18} color="var(--color-slate-mid)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>Respaldo y Portabilidad en JSON</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Exporta e importa tu avance en un archivo liviano con validación de seguridad estricta (Zod runtime).
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de Acción Principal */}
              <button
                onClick={onClose}
                style={{
                  marginTop: '6px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: 'var(--color-terracotta)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: 'var(--shadow-terracotta)'
                }}
              >
                <Sparkles size={16} />
                Explorar Mi Malla
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
