import { Link } from 'react-router-dom'
import favIcon from '../../fav_icon.png'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            <img src={favIcon} alt="RiskRadar Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-bold text-[16px] text-slate-900 tracking-tight flex items-center gap-1">
            RiskRadar <span className="text-brand-blue font-bold">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="px-3 py-1 text-xs font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 rounded-full">
            v1.0 Beta
          </span>
        </div>
      </div>
    </nav>
  )
}
