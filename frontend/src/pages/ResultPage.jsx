import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import RiskMeter from '../components/RiskMeter'
import TaskTable from '../components/TaskTable'
import Recommendations from '../components/Recommendations'

function countByCategory(tasks) {
  const counts = { repetitive: 0, creative: 0, human_interaction: 0 }
  tasks.forEach(t => {
    if (counts[t.category] !== undefined) counts[t.category]++
  })
  return counts
}

const CATEGORY_LABELS = {
  repetitive:        { label: 'Repetitive',        color: 'bg-red-100 text-red-600' },
  creative:          { label: 'Creative',           color: 'bg-emerald-100 text-emerald-700' },
  human_interaction: { label: 'Human Interaction',  color: 'bg-cyan-100 text-cyan-700' },
}

const EXPERIENCE_LABEL = {
  '0-2': '0–2 yrs', '3-5': '3–5 yrs', '5-10': '5–10 yrs', '10+': '10+ yrs',
}

export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!result) navigate('/', { replace: true })
  }, [result, navigate])

  if (!result) return null

  const {
    job_title, risk_score, risk_level, task_analysis,
    recommendations, skills_to_learn, created_at,
    experience_level, tools_used, decision_making,
  } = result

  const counts = countByCategory(task_analysis)
  const createdDate = new Date(created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  const riskInsight =
    risk_score >= 70
      ? 'High automation risk. Pivoting to human-centric and strategic work is strongly advised.'
      : risk_score >= 40
      ? 'Moderate risk. Some tasks are automatable — focus on creative and interpersonal skills.'
      : 'Low risk. Your role relies heavily on human skills that are difficult to automate.'

  const riskColor =
    risk_score >= 70 ? 'text-red-500' : risk_score >= 40 ? 'text-amber-500' : 'text-emerald-500'

  return (
    <main className="min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <button
            id="btn-back"
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Analyze another job
          </button>
          <span className="text-xs text-slate-400 font-medium">{createdDate} · #{result.id}</span>
        </div>

        {/* Page header */}
        <div className="mb-10 pb-8 border-b border-slate-200">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue mb-2">Analysis Complete</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">{job_title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {experience_level && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                {EXPERIENCE_LABEL[experience_level] || experience_level}
              </span>
            )}
            {decision_making && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600">
                {decision_making} Decision Making
              </span>
            )}
            {tools_used?.map(tool => (
              <span key={tool} className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-brand-teal/10 text-brand-teal">
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

          {/* ── LEFT SIDEBAR ── */}
          <div className="flex flex-col gap-5">

            {/* Risk Score */}
            <div className="card fade-in text-center pt-8 pb-6">
              <p className="section-label mb-5">Overall AI Risk</p>
              <RiskMeter score={risk_score} riskLevel={risk_level} />
            </div>

            {/* Risk Insight */}
            <div className="card fade-in">
              <p className="section-label mb-3">Risk Insight</p>
              <p className="text-sm text-slate-600 leading-relaxed">{riskInsight}</p>
            </div>

            {/* Task Breakdown */}
            <div className="card fade-in">
              <p className="section-label mb-4">Task Breakdown</p>
              <div className="flex flex-col gap-4">
                {Object.entries(counts).map(([cat, count]) => {
                  const cfg = CATEGORY_LABELS[cat]
                  const total = task_analysis.length
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-xs font-bold text-slate-400">{count} task{count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-blue/60 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card fade-in">
              <p className="section-label mb-4">Quick Stats</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Tasks', value: task_analysis.length },
                  { label: 'Risk Score', value: `${risk_score}/100`, color: riskColor },
                  {
                    label: 'Avg Risk',
                    value: task_analysis.length
                      ? Math.round(task_analysis.reduce((s, t) => s + t.risk_score, 0) / task_analysis.length)
                      : 0,
                  },
                  { label: 'Skills', value: skills_to_learn.length },
                ].map(stat => (
                  <div key={stat.label} className="p-3 rounded-xl bg-slate-50">
                    <p className={`text-xl font-black leading-none mb-1 ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div className="flex flex-col gap-6">

            {/* Task Analysis Table */}
            <div className="card fade-in overflow-hidden">
              <TaskTable tasks={task_analysis} />
            </div>

            {/* Recommendations */}
            <div className="card fade-in">
              <Recommendations recommendations={recommendations} skills={skills_to_learn} />
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
