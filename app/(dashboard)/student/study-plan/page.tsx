'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

export default function StudyPlanPage() {
  const [goal, setGoal] = useState('')
  const [hours, setHours] = useState(5)
  const [level, setLevel] = useState('beginner')
  const [plan, setPlan] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!goal.trim()) return setError('Tell us your goal first')
    setLoading(true)
    setError('')
    const res = await fetch('/api/ai/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, hoursPerWeek: hours, experienceLevel: level }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return setError(data.error || 'Something went wrong')
    setPlan(data.plan)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Sparkles className="text-brand-500" /> AI Study Plan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Tell the AI Teacher your goal — get a personalized 4-week plan using our courses.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4 mb-6">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium mb-1.5">What do you want to achieve?</label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={2}
            placeholder="e.g. Start earning ₦50,000/month freelancing within 3 months"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Hours/week available</label>
            <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} min={1} max={40}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Experience Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500">
              <option value="beginner">Complete Beginner</option>
              <option value="some-experience">Some Experience</option>
              <option value="intermediate">Intermediate</option>
            </select>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all">
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Generating your plan...' : 'Generate My Study Plan'}
        </button>
      </div>

      {plan && (
        <div className="bg-brand-500/5 border border-brand-200 dark:border-brand-800 rounded-2xl p-6 whitespace-pre-line text-sm leading-relaxed">
          {plan}
        </div>
      )}
    </div>
  )
}
