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
import {
  BarChart3,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  Award,
  Coins,
  Calculator,
  Users,
  Target,
  Compass,
  Globe,
  Scale,
  TrendingUp,
  Zap,
  Percent,
  Lightbulb,
  Rocket,
  Laptop,
  BookOpen,
  HelpCircle,
  Shield,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react'
import { useCurriculum } from '../context/CurriculumContext'
import { getAcademicStanding } from '../lib/curriculumEngine'

// Helper for contextual area icons styled in the official color palette
const AREA_ICON_MAP: Record<string, { icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>; color: string; bg: string }> = {
  'Finanzas': { icon: Coins, color: 'var(--color-terracotta)', bg: 'rgba(115, 72, 47, 0.12)' },
  'Contabilidad y Costos': { icon: Calculator, color: 'var(--color-steel)', bg: 'rgba(109, 134, 166, 0.12)' },
  'Talento Humano': { icon: Users, color: 'var(--color-slate-mid)', bg: 'rgba(122, 152, 191, 0.15)' },
  'Marketing y Mercadeo': { icon: Target, color: 'var(--color-terracotta)', bg: 'rgba(115, 72, 47, 0.12)' },
  'Investigación': { icon: Compass, color: 'var(--color-steel)', bg: 'rgba(109, 134, 166, 0.12)' },
  'Lengua Extranjera': { icon: Globe, color: 'var(--color-slate-mid)', bg: 'rgba(122, 152, 191, 0.15)' },
  'Legislación y Tributaria': { icon: Scale, color: 'var(--color-steel)', bg: 'rgba(109, 134, 166, 0.12)' },
  'Economía y Entorno': { icon: TrendingUp, color: 'var(--color-slate-mid)', bg: 'rgba(122, 152, 191, 0.15)' },
  'Procesos y Producción': { icon: Zap, color: 'var(--color-terracotta)', bg: 'rgba(115, 72, 47, 0.12)' },
  'Estadística y Matemáticas': { icon: Percent, color: 'var(--color-steel)', bg: 'rgba(109, 134, 166, 0.12)' },
  'Estrategia y Gerencia': { icon: Lightbulb, color: 'var(--color-terracotta)', bg: 'rgba(115, 72, 47, 0.12)' },
  'Emprendimiento e Innovación': { icon: Rocket, color: 'var(--color-terracotta)', bg: 'rgba(115, 72, 47, 0.12)' },
  'Sistemas y Tecnología': { icon: Laptop, color: 'var(--color-steel)', bg: 'rgba(109, 134, 166, 0.12)' },
  'Formación General': { icon: BookOpen, color: 'var(--color-slate-mid)', bg: 'rgba(122, 152, 191, 0.15)' }
}

const renderAreaBadge = (field: string) => {
  const config = AREA_ICON_MAP[field] || { icon: HelpCircle, color: 'var(--color-steel)', bg: 'var(--bg-card-muted)' }
  const IconComp = config.icon
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        borderRadius: '8px',
        backgroundColor: config.bg,
        color: config.color,
        flexShrink: 0
      }}
    >
      <IconComp size={16} strokeWidth={2} />
    </div>
  )
}

export const AnalyticsPage: React.FC = () => {
  const { metrics, gpaMetrics, activeTab } = useCurriculum()

  // Window Width Hook for Responsive Radar Radius & Layout
  const [windowWidth, setWindowWidth] = React.useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 800
  )

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 640
  const outerRadius = isMobile ? '50%' : '68%'
  const labelFontSize = isMobile ? 9 : 11
  const cardPadding = isMobile ? '16px 12px' : '28px'

  // Format data for Recharts Radar
  const radarData = Object.entries(metrics.creditsByField).map(([field, data]) => {
    const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    let shortName = field
    if (isMobile) {
      if (field === 'Estadística y Matemáticas') shortName = 'Estadística'
      else if (field === 'Legislación y Tributaria') shortName = 'Legislación'
      else if (field === 'Emprendimiento e Innovación') shortName = 'Emprendim.'
      else if (field === 'Contabilidad y Costos') shortName = 'Contabilidad'
      else if (field === 'Formación General') shortName = 'Form. General'
      else if (field === 'Procesos y Producción') shortName = 'Procesos'
      else if (field === 'Estrategia y Gerencia') shortName = 'Estrategia'
      else if (field === 'Sistemas y Tecnología') shortName = 'Sistemas'
      else if (field === 'Economía y Entorno') shortName = 'Economía'
      else if (field.length > 12) shortName = `${field.substring(0, 10)}...`
    } else if (field.length > 16) {
      shortName = `${field.substring(0, 14)}...`
    }

    return {
      area: shortName,
      fullArea: field,
      completados: data.completed,
      total: data.total,
      porcentaje: pct
    }
  })

  // Safe mounting condition for Recharts
  const isMounted = activeTab === 'analytics'

  // Calculate top mastered fields count
  const completedFieldsCount = Object.values(metrics.creditsByField).filter(
    (d) => d.total > 0 && d.completed === d.total
  ).length

  // Academic Standing evaluation (Minimum 3.2 Cumulative GPA)
  const standing = getAcademicStanding(gpaMetrics.cumulativeGPA)

  return (
    <div
      style={{
        padding: isMobile ? '16px 12px 32px' : '24px 20px 40px',
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* Top Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '18px 20px', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
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

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '18px 20px', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-terracotta)' }}>
              <Sparkles size={22} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Promedio Acumulado</span>
            </div>
            {standing.status === 'good' && (
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(22, 163, 74, 0.12)', color: '#16A34A', border: '1px solid rgba(22, 163, 74, 0.25)' }}>
                ≥ 3.2
              </span>
            )}
            {standing.status === 'risk' && (
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--radius-full)', backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5' }}>
                &lt; 3.2 Riesgo
              </span>
            )}
          </div>
          <p style={{ fontSize: '28px', fontWeight: 800, color: standing.status === 'risk' ? '#DC2626' : 'var(--text-primary)' }}>
            {gpaMetrics.cumulativeGPA !== null ? gpaMetrics.cumulativeGPA.toFixed(2) : 'N/A'}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {gpaMetrics.gradedCoursesCount > 0
              ? `${gpaMetrics.gradedCoursesCount} materias con nota (${gpaMetrics.totalCreditsWithGrade} cr)`
              : 'Sin notas calificadas aún'}
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '18px 20px', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
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

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '18px 20px', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-steel)', marginBottom: '8px' }}>
            <Award size={22} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Dominio Temático</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {completedFieldsCount} / 14
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Áreas 100% completadas
          </p>
        </div>
      </div>

      {/* Tarjeta de Estado de Permanencia Académica (Reglamento Estudiantil) */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: cardPadding,
          border: `1px solid ${
            standing.status === 'risk'
              ? '#FCA5A5'
              : standing.status === 'good'
              ? 'rgba(22, 163, 74, 0.3)'
              : 'var(--border-card)'
          }`,
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '260px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor:
                standing.status === 'risk'
                  ? '#FEE2E2'
                  : standing.status === 'good'
                  ? 'rgba(22, 163, 74, 0.12)'
                  : 'var(--bg-card-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {standing.status === 'risk' ? (
              <ShieldAlert size={24} color="#DC2626" />
            ) : standing.status === 'good' ? (
              <ShieldCheck size={24} color="#16A34A" />
            ) : (
              <Shield size={24} color="var(--color-steel)" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Estado de Permanencia Académica
              </h3>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor:
                    standing.status === 'risk'
                      ? '#FEE2E2'
                      : standing.status === 'good'
                      ? 'rgba(22, 163, 74, 0.12)'
                      : 'var(--bg-card-muted)',
                  color:
                    standing.status === 'risk'
                      ? '#DC2626'
                      : standing.status === 'good'
                      ? '#16A34A'
                      : 'var(--text-secondary)'
                }}
              >
                {standing.status === 'risk'
                  ? '⚠️ Riesgo de Pérdida de Cupo (< 3.2)'
                  : standing.status === 'good'
                  ? '✓ En Permanencia (≥ 3.2)'
                  : 'Pendiente de Evaluación'}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {standing.status === 'risk'
                ? `ATENCIÓN: Tu promedio de ${gpaMetrics.cumulativeGPA?.toFixed(2)} está ${Math.abs(standing.difference || 0).toFixed(2)} puntos por debajo del mínimo de 3.2 exigido para mantener la calidad de estudiante.`
                : standing.status === 'good'
                ? `Tu promedio de ${gpaMetrics.cumulativeGPA?.toFixed(2)} está +${standing.difference?.toFixed(2)} puntos sobre el mínimo exigido de 3.2 en el Reglamento Estudiantil.`
                : 'Registra tus notas en las asignaturas calificadas para verificar el cumplimiento de permanencia mínima (3.2 acumulado).'}
            </p>
          </div>
        </div>

        <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Regla de Permanencia</span>
          <strong style={{ fontSize: '14px', color: 'var(--color-steel)' }}>Mínimo 3.2 Acumulado</strong>
        </div>
      </div>

      {/* Recharts Radar Chart Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: cardPadding,
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '12px' : '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--bg-card-muted)', color: 'var(--color-terracotta)' }}>
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: 700 }}>Radar de Competencias</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Equilibrio de créditos aprobados por área temática
              </p>
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px', backgroundColor: 'var(--bg-card-muted)', color: 'var(--text-secondary)' }}>
            14 Áreas
          </span>
        </div>

        <div
          tabIndex={-1}
          style={{
            width: '100%',
            height: isMobile ? '310px' : '360px',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none'
          }}
        >
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                data={radarData}
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
              >
                <defs>
                  <linearGradient id="radarTerracotta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-terracotta)" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="var(--color-sand)" stopOpacity={0.25} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="rgba(122, 152, 191, 0.30)" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="area"
                  stroke="var(--text-secondary)"
                  tick={{ fontSize: labelFontSize, fontWeight: 600, fill: 'var(--text-primary)' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="var(--color-slate-light)"
                  tick={{ fontSize: 9, fill: 'var(--text-secondary)' }}
                />
                <Radar
                  name="Dominio (%)"
                  dataKey="porcentaje"
                  stroke="var(--color-terracotta)"
                  strokeWidth={2}
                  fill="url(#radarTerracotta)"
                  fillOpacity={0.8}
                  dot={{ r: 3, fill: 'var(--color-terracotta)', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: 'var(--color-terracotta)', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
                <Tooltip
                  formatter={(value: any, _name: any, item: any) => [
                    `${value}% (${item?.payload?.completados || 0}/${item?.payload?.total || 0} cr)`,
                    item?.payload?.fullArea || 'Área'
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '10px',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    padding: '8px 12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Detailed List of Learning Fields with Progress & Badges */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: isMobile ? '18px 14px' : '24px',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h4 style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--color-terracotta)" />
            Desglose por Áreas de Conocimiento
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Créditos Aprobados
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Object.entries(metrics.creditsByField).map(([field, data]) => {
            const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
            const isCompleted = pct === 100 && data.total > 0
            const isInProgress = pct > 0 && pct < 100

            return (
              <div
                key={field}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid rgba(164, 173, 191, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {renderAreaBadge(field)}
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{field}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isCompleted ? (
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', backgroundColor: 'rgba(115, 72, 47, 0.12)', color: 'var(--color-terracotta)' }}>
                        ✓ Dominado
                      </span>
                    ) : isInProgress ? (
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', backgroundColor: 'rgba(122, 152, 191, 0.15)', color: 'var(--color-steel)' }}>
                        En Progreso
                      </span>
                    ) : null}

                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {data.completed} / {data.total} cr ({pct}%)
                    </span>
                  </div>
                </div>

                {/* Styled Gradient Progress Bar */}
                <div style={{ height: '7px', backgroundColor: 'var(--bg-card-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: isCompleted
                        ? 'linear-gradient(90deg, #73482F 0%, #A36B48 100%)'
                        : 'linear-gradient(90deg, #6D86A6 0%, #7A98BF 100%)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


