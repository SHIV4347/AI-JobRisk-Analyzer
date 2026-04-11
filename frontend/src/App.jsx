import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'
import favIcon from '../fav_icon.png'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultPage />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 py-8 bg-white/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 relative flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 z-10">
            <img src={favIcon} alt="Logo" className="w-12 h-12 object-contain" />
            <span className="font-bold text-xl text-slate-900 tracking-tight">JobSense AI</span>
          </div>

          {/* Center: Tagline (Absolute centered on MD+) */}
          <div className="md:absolute md:left-1/2 md:-translate-x-1/2 text-center pointer-events-none">
            <p className="text-[12px] font-black text-brand-blue/80 tracking-[0.15em] uppercase">
              Understand your job. Stay ahead of AI.
            </p>
          </div>

          {/* Right: Version/Copyright */}
          <div className="text-[12px] font-bold text-slate-400 tracking-wide z-10">
            © 2026 · <span className="text-slate-500">v1.0 Beta</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
