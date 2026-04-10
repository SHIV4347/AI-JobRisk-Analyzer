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
  repetitive: { label: 'Repetitive', badge: 'badge-red' },
  creative: { label: 'Creative', badge: 'badge-green' },
  human_interaction: { label: 'Human Interaction', badge: 'badge-cyan' },
}

const EXPERIENCE_LABEL = {
  '0-2': '0–2 years',
  '3-5': '3–5 years',
  '5-10': '5–10 years',
  '10+': '10+ years',
}

const DECISION_COLOR = {
  Low: 'text-amber-600',
  Medium: 'text-brand-blue',
  High: 'text-emerald-600',
}

export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result

  useEffect(() => {
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
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const riskInsight =
    risk_score >= 70
      ? 'High automation risk. Pivoting to human-centric and strategic work is strongly advised.'
      : risk_score >= 40
      ? 'Moderate risk. Some tasks are automatable — focus on creative and interpersonal skills.'
      : 'Low risk. Your role relies heavily on human skills that are difficult to automate.'

  return (
    <main className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <button
            id="btn-back"
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Analyze another job
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {createdDate} · #{result.id}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">Analysis complete</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{job_title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Based on {task_analysis.length} task{task_analysis.length !== 1 ? 's' : ''} analyzed
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {/* Experience */}
            {experience_level && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                {EXPERIENCE_LABEL[experience_level] || experience_level}
              </span>
            )}
            {/* Decision making */}
            {decision_making && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 border border-slate-200 ${DECISION_COLOR[decision_making] || 'text-slate-700'}`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z"/><path d="M12 8v4l3 3"/>
                </svg>
                {decision_making} Decision Making
              </span>
            )}
            {/* Tools */}
            {tools_used && tools_used.length > 0 && tools_used.map(tool => (
              <span
                key={tool}
                className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">
          <div className="flex flex-col gap-5">

            {/* Risk score card */}
            <div className="card fade-in text-center py-8">
              <p className="section-label mb-6">Overall AI Risk</p>
              <RiskMeter score={risk_score} riskLevel={risk_level} />
            </div>

            {/* Scoring factors */}
            <div className="card fade-in">
              <p className="section-label">Scoring Factors</p>
              <div className="flex flex-col gap-3 mt-1">
                {/* Experience */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Experience</span>
                  <span className="text-slate-300 font-semibold">
                    {experience_level === '0-2' && <span className="text-red-400">+15 (junior)</span>}
                    {experience_level === '3-5' && <span className="text-slate-400">±0 (mid)</span>}
                    {experience_level === '5-10' && <span className="text-slate-400">±0 (senior)</span>}
                    {experience_level === '10+' && <span className="text-emerald-400">-15 (expert)</span>}
                  </span>
                </div>
                {/* Decision */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Decision Making</span>
                  <span className="font-semibold">
                    {decision_making === 'High' && <span className="text-emerald-400">-10</span>}
                    {decision_making === 'Medium' && <span className="text-slate-400">-5</span>}
                    {decision_making === 'Low' && <span className="text-slate-400">±0</span>}
                  </span>
                </div>
                {/* Tools */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Tool Modernity</span>
                  <span className="font-semibold text-slate-400">
                    {tools_used && tools_used.length > 0 ? (
                      <span className="text-emerald-400">-10 (adaptive)</span>
                    ) : (
                      <span className="text-red-400">+10 (no tools)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Task breakdown */}
            <div className="card fade-in">
              <p className="section-label">Task Breakdown</p>
              <div className="flex flex-col gap-3">
                {Object.entries(counts).map(([cat, count]) => {
                  const cfg = CATEGORY_LABELS[cat]
                  const total = task_analysis.length
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={cfg.badge}>{cfg.label}</span>
                        <span className="text-xs font-semibold text-slate-400 tabular-nums">{count}</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white/20 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Risk insight */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed">{riskInsight}</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="card fade-in">
              <p className="section-label">Quick Stats</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Tasks Analyzed', value: task_analysis.length },
                  { label: 'Risk Score', value: `${risk_score}/100` },
                  {
                    label: 'Avg Task Risk',
                    value: task_analysis.length
                      ? Math.round(task_analysis.reduce((s, t) => s + t.risk_score, 0) / task_analysis.length)
                      : 0
                  },
                  { label: 'Skills Suggested', value: skills_to_learn.length },
                ].map(stat => (
                  <div key={stat.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-lg font-black text-slate-900 leading-none mb-1">{stat.value}</p>
                    <p className="text-[11px] text-slate-500 font-bold leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">

            {/* Task Table */}
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
