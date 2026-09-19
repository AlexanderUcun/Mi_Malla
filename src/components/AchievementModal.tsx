import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy, Sparkles, X } from 'lucide-react'

interface AchievementModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  iconName?: string
  levelTitle?: string
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  levelTitle
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger canvas-confetti blast for legendary milestones
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#73482F', '#7A98BF', '#D9D3C7', '#6D86A6', '#F59E0B']
        })
      } catch {
        // ignore if fails
      }
    }
  }, [isOpen])

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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(6px)',
            padding: '20px'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px 24px',
              boxShadow: 'var(--shadow-lg)',
              textAlign: 'center',
              border: '2px solid var(--color-terracotta)',
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
                color: 'var(--text-secondary)'
              }}
            >
              <X size={20} />
            </button>

            {/* Trophy Icon Badge */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FDF0EC',
                border: '3px solid var(--color-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: 'var(--shadow-terracotta)'
              }}
            >
              <Trophy size={42} color="var(--color-terracotta)" />
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--color-terracotta)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '4px'
              }}
            >
              ¡Hito Legendario Desbloqueado!
            </span>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {title}
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              {description}
            </p>

            {levelTitle && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-card)',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={16} color="var(--color-terracotta)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-terracotta)' }}>
                  {levelTitle}
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'var(--color-terracotta)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-terracotta)'
              }}
            >
              ¡Continuar mi Malla!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
