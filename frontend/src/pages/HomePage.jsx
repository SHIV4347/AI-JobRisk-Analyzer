import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const EXAMPLE_JOBS = [
  {
    title: 'Data Analyst',
    tasks: ['Collect data from spreadsheets', 'Generate weekly reports', 'Visualize trends using charts', 'Communicate findings to stakeholders'],
    experience_level: '3-5',
    tools_used: ['Excel', 'SQL', 'Tableau'],
    decision_making: 'Medium',
  },
  {
    title: 'Software Engineer',
    tasks: ['Design system architecture', 'Write and review code', 'Debug production issues', 'Collaborate in agile ceremonies'],
    experience_level: '5-10',
    tools_used: ['Python', 'GitHub', 'Docker', 'AI tools'],
    decision_making: 'High',
  },
  {
    title: 'Customer Support Rep',
    tasks: ['Answer customer queries via email', 'Log support tickets', 'Escalate unresolved issues', 'Empathize and counsel distressed customers'],
    experience_level: '0-2',
    tools_used: ['Excel'],
    decision_making: 'Low',
  },
]

const HOW_IT_WORKS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    step: '01',
    title: 'Enter Details',
    desc: 'Add your job title, experience, tools, and daily tasks',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    step: '02',
    title: 'AI Analyzes',
    desc: 'AI classifies and scores each task for automation risk',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    step: '03',
    title: 'Get Report',
    desc: 'Review your overall risk score and detailed task breakdown',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    step: '04',
    title: 'Take Action',
    desc: 'Follow personalized recommendations and skill suggestions',
  },
]

const EXPERIENCE_OPTIONS = ['0-2', '3-5', '5-10', '10+']
const DECISION_OPTIONS = ['Low', 'Medium', 'High']

export default function HomePage() {
  const navigate = useNavigate()
  const [jobTitle, setJobTitle] = useState('')
  const [tasks, setTasks] = useState(['', '', ''])
  const [experienceLevel, setExperienceLevel] = useState('3-5')
  const [toolsUsed, setToolsUsed] = useState([])
  const [toolInput, setToolInput] = useState('')
  const [decisionMaking, setDecisionMaking] = useState('Medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addTask = () => { if (tasks.length < 15) setTasks([...tasks, '']) }
  const removeTask = (idx) => { if (tasks.length > 1) setTasks(tasks.filter((_, i) => i !== idx)) }
  const updateTask = (idx, value) => { const u = [...tasks]; u[idx] = value; setTasks(u) }

  const addTool = () => {
    const trimmed = toolInput.trim()
    if (trimmed && !toolsUsed.includes(trimmed) && toolsUsed.length < 15) {
      setToolsUsed([...toolsUsed, trimmed])
      setToolInput('')
    }
  }
  const removeTool = (tool) => setToolsUsed(toolsUsed.filter(t => t !== tool))
  const handleToolKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); addTool() } }

  const loadExample = (ex) => {
    setJobTitle(ex.title)
    setTasks(ex.tasks)
    setExperienceLevel(ex.experience_level)
    setToolsUsed(ex.tools_used)
    setDecisionMaking(ex.decision_making)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const validTasks = tasks.map(t => t.trim()).filter(Boolean)
    if (!jobTitle.trim()) { setError('Please enter a job title.'); return }
    if (validTasks.length === 0) { setError('Please add at least one task.'); return }

    setLoading(true)
    try {
      const res = await api.post('/api/analyze-job', {
        job_title: jobTitle.trim(),
        tasks: validTasks,
        experience_level: experienceLevel,
        tools_used: toolsUsed,
        decision_making: decisionMaking,
      })
      navigate('/results', { state: { result: res.data } })
    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong. Please try again.'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col w-full">
      {/* --- HERO SECTION --- */}
      <section className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
          {/* Eyebrow label */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/8 border border-brand-blue/15 text-brand-blue text-[11px] font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block"></span>
            AI Automation Risk Analyzer
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-[60px] font-black text-slate-900 mb-6 tracking-tight leading-[1.08] max-w-3xl">
            Is your job at risk<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-teal">from AI automation?</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-10">
            Enter your job role, experience, tools, and daily tasks.
            Our AI will assess automation risk and give you an actionable plan.
          </p>
          <a href="#analyze" className="btn-primary w-auto px-8 py-3.5 text-base rounded-full inline-flex items-center gap-2 transition-all hover:scale-105 shadow-md hover:shadow-lg">
            Start Free Analysis
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </a>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" className="w-full scroll-mt-20 px-6 py-12 bg-slate-50/60 border-t border-slate-200/60">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">How it Works</h2>
            <p className="text-sm text-slate-500">Four simple steps to understand your AI risk.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 stagger">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="flex flex-col gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:bg-blue-50/50 hover:border-brand-blue/20 transition-all duration-150 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/8 border border-brand-blue/15 flex items-center justify-center text-brand-blue">
                    {step.icon}
                  </div>
                  <span className="text-xs font-mono font-black text-slate-400">{step.step}</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800 mb-1.5">{step.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FORM SECTION --- */}
      <section id="analyze" className="w-full px-6 pt-6 pb-16 border-t border-slate-200/60 scroll-mt-0">
        <div className="w-full max-w-6xl mx-auto flex flex-col">

          {/* Section header + examples */}
          <div className="mb-4">
            <div className="mb-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Analyze Your Job</h2>
              <p className="text-sm text-slate-500">Fill in your details and let AI assess your risk level.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mr-1">Try:</span>
              {EXAMPLE_JOBS.map((ex) => (
                <button
                  key={ex.title}
                  id={`example-${ex.title.toLowerCase().replace(/\s/g, '-')}`}
                  className="btn-secondary text-xs px-3 py-1.5"
                  onClick={() => loadExample(ex)}
                >
                  {ex.title}
                </button>
              ))}
            </div>
          </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="card fade-in w-full p-6 sm:p-8">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 mb-5 rounded-lg bg-red-500/[0.08] border border-red-500/[0.2] text-red-400 text-sm">
              <svg className="flex-shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* --- LEFT COLUMN --- */}
            <div className="flex flex-col justify-between">
              {/* Group Job Title and Experience together to align bottom tools with bottom add-task */}
              <div>
                {/* Job Title */}
                <div className="mb-5">
                  <label htmlFor="job-title" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Job Title
                  </label>
                  <input
                    id="job-title"
                    className="form-input"
                    type="text"
                    placeholder="e.g. Data Analyst, Software Engineer, Accountant"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    maxLength={200}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label htmlFor="experience-level" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Experience (years)
                    </label>
                    <select
                      id="experience-level"
                      className="form-input"
                      value={experienceLevel}
                      onChange={e => setExperienceLevel(e.target.value)}
                    >
                      {EXPERIENCE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt} years</option>
                      ))}
                    </select>
                  </div>

                  {/* Decision Making */}
                  <div>
                    <label htmlFor="decision-making" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Decision Making
                    </label>
                    <select
                      id="decision-making"
                      className="form-input"
                      value={decisionMaking}
                      onChange={e => setDecisionMaking(e.target.value)}
                    >
                      {DECISION_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tools Used - This will now be pushed to the bottom along with the right side button */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Tools & Technologies Used
                </label>
                <p className="text-xs text-slate-600 mb-3">
                  Type a tool and press Enter or click Add
                </p>

                {/* Tag chips */}
                {toolsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {toolsUsed.map(tool => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue"
                      >
                        {tool}
                        <button
                          type="button"
                          onClick={() => removeTool(tool)}
                          className="text-brand-blue hover:text-red-500 transition-colors duration-100"
                          title={`Remove ${tool}`}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tool input row */}
                <div className="flex gap-2">
                  <input
                    id="tool-input"
                    className="form-input flex-1"
                    type="text"
                    placeholder="e.g. Excel, Python, AI tools, Salesforce"
                    value={toolInput}
                    onChange={e => setToolInput(e.target.value)}
                    onKeyDown={handleToolKeyDown}
                  />
                  <button
                    type="button"
                    nonce="btn-add-tool"
                    onClick={addTool}
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:border-brand-blue/40 hover:text-brand-blue hover:bg-brand-blue/5 transition-all duration-150 whitespace-nowrap shadow-sm"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="flex flex-col justify-between">
              {/* Tasks label + inputs */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Daily Tasks
                </label>
                <p className="text-xs text-slate-600 mb-3">
                  Describe what you actually do day-to-day (up to 15 tasks)
                </p>

                <div className="flex flex-col gap-2 mb-2">
                  {tasks.map((task, idx) => (
                    <div key={idx} className="task-row-anim flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md flex-shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 font-mono">
                        {idx + 1}
                      </span>
                      <input
                        id={`task-input-${idx}`}
                        className="form-input flex-1"
                        type="text"
                        placeholder={`Task ${idx + 1} — e.g. "Prepare monthly financial reports"`}
                        value={task}
                        onChange={e => updateTask(idx, e.target.value)}
                      />
                      {tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(idx)}
                          title="Remove task"
                          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-white/[0.07] bg-transparent text-slate-600 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all duration-150"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
              </div>
              </div>

              {/* Add task button — pushed to bottom by justify-between to align with Tool input row */}
              {tasks.length < 15 && (
                <button
                  type="button"
                  id="btn-add-task"
                  onClick={addTask}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                             border border-dashed border-slate-300 rounded-lg
                             text-slate-400 text-sm font-semibold
                             hover:border-brand-blue/40 hover:text-brand-blue hover:bg-brand-blue/5
                             transition-all duration-150"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add another task
                </button>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-4 pt-6 border-t border-slate-100/60">
            <button
              id="btn-analyze"
              type="submit"
              className="btn-primary py-3.5 w-full md:w-auto md:px-12 mx-auto"
              disabled={loading}
            >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Analyzing with AI...
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Analyze My Job Risk
              </>
            )}
            </button>
          </div>
        </form>

        </div>
      </section>


    </main>
  )
}
