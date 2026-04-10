import { useEffect, useState } from 'react'

const RADIUS = 60
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getRiskColor(score) {
  if (score >= 70) return { stroke: '#ef4444', text: 'text-red-500', bg: 'badge-red', label: 'High Risk' }
  if (score >= 40) return { stroke: '#f59e0b', text: 'text-amber-500', bg: 'badge-yellow', label: 'Medium Risk' }
  return { stroke: '#10b981', text: 'text-emerald-500', bg: 'badge-green', label: 'Low Risk' }
}

export default function RiskMeter({ score, riskLevel }) {
  const [animScore, setAnimScore] = useState(0)
  const colors = getRiskColor(score)

  useEffect(() => {
    let start = null
    const duration = 1000
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimScore(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [score])

  const offset = CIRCUMFERENCE - (animScore / 100) * CIRCUMFERENCE

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Ring */}
      <div className="relative w-40 h-40">
        <svg className="risk-ring-svg w-full h-full" viewBox="0 0 160 160">
          <circle className="ring-track" cx="80" cy="80" r={RADIUS} />
          <circle
            className="ring-fill-line"
            cx="80"
            cy="80"
            r={RADIUS}
            stroke={colors.stroke}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>

        {/* Score label centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black leading-none ${colors.text}`}>{animScore}</span>
          <span className="text-[11px] text-blue-200/40 font-bold mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Risk level badge */}
      <span className={colors.bg}>{riskLevel || colors.label}</span>

      {/* Subtle description */}
      <p className="text-xs text-blue-200/60 text-center leading-relaxed max-w-[180px]">
        {score >= 70
          ? 'High automation exposure detected'
          : score >= 40
          ? 'Moderate automation exposure'
          : 'Role is resilient to automation'}
      </p>
    </div>
  )
}
