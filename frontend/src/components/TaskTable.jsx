function getScoreColor(score) {
  if (score >= 70) return { bar: 'score-bar-fill-high', text: 'text-red-400' }
  if (score >= 40) return { bar: 'score-bar-fill-medium', text: 'text-yellow-400' }
  return { bar: 'score-bar-fill-low', text: 'text-emerald-400' }
}

function getCategoryBadge(category) {
  switch (category) {
    case 'repetitive':        return 'badge-red'
    case 'creative':          return 'badge-green'
    case 'human_interaction': return 'badge-cyan'
    default:                  return 'badge-indigo'
  }
}

function getReplaceabilityBadge(r) {
  switch (r) {
    case 'High':   return 'badge-red'
    case 'Medium': return 'badge-yellow'
    case 'Low':    return 'badge-green'
    default:       return 'badge-indigo'
  }
}

export default function TaskTable({ tasks }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Task Analysis</h2>
          <p className="text-xs text-slate-500 font-medium">{tasks.length} task{tasks.length !== 1 ? 's' : ''} evaluated</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pl-6 pb-3 text-left w-10 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">#</th>
              <th className="pb-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Task</th>
              <th className="pb-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-slate-500 hidden sm:table-cell">Category</th>
              <th className="pb-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-slate-500 hidden md:table-cell">Replaceability</th>
              <th className="pb-3 pr-6 text-right text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Risk</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => {
              const scoreColors = getScoreColor(t.risk_score)
              return (
                <tr
                  key={i}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors duration-100 group"
                >
                  <td className="pl-6 py-3.5 text-slate-400 font-mono text-[11px] font-bold">{String(i + 1).padStart(2, '0')}</td>
                  <td className="py-3.5 pr-4 text-slate-700 font-semibold max-w-[240px] leading-snug">{t.task}</td>
                  <td className="py-3.5 pr-4 hidden sm:table-cell">
                    <span className={getCategoryBadge(t.category)}>
                      {t.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 hidden md:table-cell">
                    <span className={getReplaceabilityBadge(t.replaceability)}>
                      {t.replaceability}
                    </span>
                  </td>
                  <td className="py-3.5 pr-6">
                    <div className="flex items-center gap-2.5 justify-end">
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${scoreColors.bar}`}
                          style={{ width: `${t.risk_score}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold tabular-nums w-7 text-right ${scoreColors.text}`}>
                        {t.risk_score}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
