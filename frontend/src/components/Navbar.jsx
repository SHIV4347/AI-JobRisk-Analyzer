import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-base flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <span className="font-bold text-[15px] text-slate-100 tracking-tight">
            RiskRadar <span className="text-slate-500 font-medium">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="badge-indigo">Beta</span>
        </div>
      </div>
    </nav>
  )
}
