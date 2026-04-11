import { Link } from 'react-router-dom'
import favIcon from '../../fav_icon.png'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            <img src={favIcon} alt="JobSense AI Logo" className="w-12 h-12 object-contain" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight flex items-center gap-1">
            JobSense <span className="text-brand-blue font-bold">AI</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          <a href="/" className="text-[13px] font-bold text-slate-500 hover:text-brand-blue transition-colors uppercase tracking-wide">Home</a>
          <a href="#how-it-works" className="text-[13px] font-bold text-slate-500 hover:text-brand-blue transition-colors uppercase tracking-wide">How it Works</a>
          <a href="#analyze" className="text-[13px] font-bold text-brand-blue bg-brand-blue/10 px-4 py-2 flex items-center justify-center rounded-full hover:bg-brand-blue/20 transition-colors">Analyze Job</a>
        </div>
      </div>
    </nav>
  )
}
