import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
      <footer className="border-t border-white/[0.05] py-6 mt-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-600">
            © 2024 RiskRadar AI · Built to future-proof your career
          </p>
          <p className="text-xs text-slate-700">
            Powered by Google Gemini
          </p>
        </div>
      </footer>
    </>
  )
}
