// Icon components for recommendations
const icons = {
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  star: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  book: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  zap: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  target: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  trending: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  layers: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  link: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
}

const ICON_KEYS = ['arrow', 'star', 'book', 'zap', 'target', 'trending', 'layers', 'link']

export default function Recommendations({ recommendations, skills }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-brand-teal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4m0 4h.01"/>
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Recommendations</h2>
            <p className="text-xs text-slate-500 font-medium">{recommendations.length} action item{recommendations.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <ol className="flex flex-col gap-2 stagger">
          {recommendations.map((rec, i) => (
            <li
              key={i}
              className="flex gap-3 items-start p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50/80 hover:border-slate-200 transition-all duration-150"
            >
              <div className="w-6 h-6 rounded-md bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal flex-shrink-0 mt-0.5">
                {icons[ICON_KEYS[i % ICON_KEYS.length]]}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-semibold">{rec}</p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-emerald-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Skills to Learn</h2>
            <p className="text-xs text-slate-500 font-medium">{skills.length} recommended skill{skills.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 stagger">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-[13px] font-bold hover:bg-slate-100 hover:border-slate-300 transition-all duration-150 cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}
