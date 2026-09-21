import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Cpu, Database, Award, ArrowLeft, Layers } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'

export const PWAPresentationPage: React.FC = () => {
  const { setActiveTab } = useCurriculum()

  return (
    <div style={{ padding: '28px 20px 40px', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Botón de retorno rápido */}
      <div>
        <button
          onClick={() => setActiveTab('malla')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-card)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--color-steel)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <ArrowLeft size={16} /> Volver a la Malla Curricular
        </button>
      </div>

      {/* Hero Section Principal de la PWA */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-md)',
          padding: '40px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #FDF0EC 0%, #FFFFFF 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Isotipo Animado en Framer Motion */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '28px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxShadow: '0 12px 32px rgba(115, 72, 47, 0.18)',
            border: '3px solid var(--color-terracotta)',
            marginBottom: '20px'
          }}
        >
          <img src="./logo.svg" alt="Mi Malla Logo" style={{ width: '100%', height: '100%' }} />
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Mi Malla
          </h1>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-terracotta)',
              color: '#FFFFFF',
              letterSpacing: '0.05em'
            }}
          >
            PWA OFICIAL
          </span>
        </div>

        <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-terracotta)', marginBottom: '4px' }}>
          Administración de Empresas · Universidad de Cundinamarca (Sede Chía)
        </p>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '620px', lineHeight: 1.5 }}>
          Plataforma web progresiva (PWA) de alto rendimiento para el seguimiento continuo de progreso académico,
          grafo dinámico de prerrequisitos y motor de gamificación estilo árbol de talentos (Skill Tree).
        </p>

        {/* Métricas destacadas en barra Horizontal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '14px',
            width: '100%',
            maxWidth: '680px',
            marginTop: '28px'
          }}
        >
          <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Períodos Académicos</span>
            <strong style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: 800 }}>9 Semestres</strong>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Créditos Académicos</span>
            <strong style={{ fontSize: '20px', color: 'var(--color-terracotta)', fontWeight: 800 }}>158 Créditos</strong>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Total Asignaturas</span>
            <strong style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: 800 }}>66 Materias</strong>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Modalidad & Sede</span>
            <strong style={{ fontSize: '20px', color: 'var(--color-steel)', fontWeight: 800 }}>Mixta · Chía</strong>
          </div>
        </div>
      </div>

      {/* Secciones de Características Técnicas de la PWA */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={22} color="var(--color-terracotta)" /> Arquitectura & Funcionalidades Clave
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
          {/* Card 1: Local-First */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', backgroundColor: '#FDF0EC', border: '1px solid var(--color-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} color="var(--color-terracotta)" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Persistencia 100% Offline & Local-First</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Privacidad absoluta sin registro ni servidores externos</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Construida sobre <strong>Dexie.js (IndexedDB)</strong> para una persistencia ultrarresistente a purgas de navegador. Al iniciar la PWA, los datos se hidratan directamente en la RAM para ofrecer consultas reactivas instantáneas a 0 ms de latencia.
            </p>
          </div>

          {/* Card 2: Chain Glow Graph */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', backgroundColor: '#EFF6FF', border: '1px solid #3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={22} color="#2563EB" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Grafo Dirigido Acíclico (DAG)</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Resplandor bidireccional (Chain Glow)</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              La malla evalúa automáticamente los desbloqueos por prerrequisitos en tiempo real. Al pasar el cursor o tocar una materia, se iluminan sus <strong>requisitos previos antecedente</strong> en ámbar y las <strong>materias que desbloqueas a futuro</strong> en terracota.
            </p>
          </div>

          {/* Card 3: Gamificación RPG */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={22} color="#D97706" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Gamificación & Árbol de Talentos</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Metáfora RPG con 10 Niveles Progresivos</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Cada crédito académico aprobado otorga <strong>100 XP</strong> (Pénsum total = 15,800 XP). Supera pruebas de diagnóstico, completa semestres enteros y áreas temáticas para desbloquear medallas y tu Ficha de Personaje descargable.
            </p>
          </div>

          {/* Card 4: Portabilidad JSON */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={22} color="var(--color-steel)" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Respaldo y Portabilidad JSON</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Transferencia rápida entre dispositivos</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Exporta tu avance en un archivo <code>.json</code> liviano para restaurarlo o transferirlo entre tu celular y tu computadora. Todas las importaciones cuentan con validación runtime estricta a través de esquemas <strong>Zod</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Botón Flotante inferior para ir a la Malla */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <button
          onClick={() => setActiveTab('malla')}
          style={{
            padding: '14px 32px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            backgroundColor: 'var(--color-terracotta)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-terracotta)'
          }}
        >
          <Sparkles size={18} />
          Explorar la Malla Curricular
        </button>
      </div>
    </div>
  )
}
