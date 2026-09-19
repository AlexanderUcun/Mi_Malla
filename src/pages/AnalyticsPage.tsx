import React from 'react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts'
import { BarChart3, GraduationCap, CheckCircle2, Clock } from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'

export const AnalyticsPage: React.FC = () => {
  const { metrics, activeTab } = useCurriculum()

  // Format data for Recharts Radar
  const radarData = Object.entries(metrics.creditsByField).map(([field, data]) => {
    const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    return {
      area: field.length > 15 ? `${field.substring(0, 13)}...` : field,
      fullArea: field,
      completados: data.completed,
      total: data.total,
      porcentaje: pct
    }
  })

  // Safe mounting condition for Recharts to avoid width: 0 height: 0 errors
  const isMounted = activeTab === 'analytics'

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
            <GraduationCap size={22} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Avance de Carrera</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {Math.round(metrics.completionPercentage)}%
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {metrics.completedCredits} de {metrics.totalCredits} Créditos Aprobados
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-slate-mid)', marginBottom: '8px' }}>
            <CheckCircle2 size={22} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Asignaturas Superadas</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {metrics.completedCoursesCount} / {metrics.totalCoursesCount}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {metrics.totalCoursesCount - metrics.completedCoursesCount} Materias pendientes
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-steel)', marginBottom: '8px' }}>
            <Clock size={22} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Pénsum Oficial</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            9 Semestres
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Res. UDEC Chía · Admin. de Empresas
          </p>
        </div>
      </div>

      {/* Recharts Radar Chart */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <BarChart3 size={24} color="var(--color-terracotta)" />
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Radar de Competencias por Área Temática</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Equilibrio de créditos aprobados en las 14 áreas de aprendizaje
            </p>
          </div>
        </div>

        <div style={{ width: '100%', height: '360px' }}>
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="var(--border-card)" />
                <PolarAngleAxis dataKey="area" stroke="var(--text-secondary)" tick={{ fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                <Radar
                  name="Porcentaje Aprobado"
                  dataKey="porcentaje"
                  stroke="var(--color-terracotta)"
                  fill="var(--color-terracotta)"
                  fillOpacity={0.45}
                />
                <Tooltip
                  formatter={(value: any) => [`${value}% Dominado`, 'Porcentaje']}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px', borderColor: 'var(--border-card)', color: 'var(--text-primary)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Detailed Table of Learning Fields */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-card)' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Desglose Detallado por Áreas de Conocimiento</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(metrics.creditsByField).map(([field, data]) => {
            const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
            return (
              <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span>{field}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {data.completed} / {data.total} cr ({pct}%)
                  </span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-card-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--color-terracotta)', borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
