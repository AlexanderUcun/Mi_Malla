import React from 'react'

export const SkeletonLoader: React.FC = () => {
  return (
    <div
      style={{
        padding: '24px 16px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
      aria-label="Cargando datos de la malla curricular..."
      role="status"
    >
      {/* Header skeleton */}
      <div
        style={{
          height: '72px',
          backgroundColor: 'var(--bg-card-muted, #EFECE6)',
          borderRadius: '16px',
          animation: 'pulse 1.5s infinite ease-in-out',
        }}
      />

      {/* Period Selector skeleton */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div
            key={i}
            style={{
              minWidth: '70px',
              height: '40px',
              backgroundColor: 'var(--bg-card-muted, #EFECE6)',
              borderRadius: '20px',
              animation: 'pulse 1.5s infinite ease-in-out',
            }}
          />
        ))}
      </div>

      {/* Grid of Course Cards skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              height: '140px',
              backgroundColor: 'var(--bg-card, #FFFFFF)',
              border: '1px solid var(--border-card, rgba(164, 173, 191, 0.4))',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: 'pulse 1.5s infinite ease-in-out',
            }}
          >
            <div
              style={{
                width: '60%',
                height: '18px',
                backgroundColor: 'var(--bg-card-muted, #EFECE6)',
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                width: '90%',
                height: '24px',
                backgroundColor: 'var(--bg-card-muted, #EFECE6)',
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                width: '40%',
                height: '14px',
                backgroundColor: 'var(--bg-card-muted, #EFECE6)',
                borderRadius: '4px',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
