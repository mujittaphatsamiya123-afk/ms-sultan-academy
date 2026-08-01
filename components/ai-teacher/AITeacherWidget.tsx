'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Loader2, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AITeacherWidget({
  courseId,
  lessonContext,
}: {
  courseId?: string
  lessonContext?: string
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setError('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, courseId, lessonContext }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setError('Network error — please try again.')
    }
    setLoading(false)
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-3.5 rounded-full shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-0.5"
        >
          <Sparkles size={18} /> <span className="hidden sm:inline">Ask AI Teacher</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-50 w-full sm:w-96 h-[85vh] sm:h-[600px] bg-white dark:bg-slate-900 sm:border border-slate-100 dark:border-slate-800 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 bg-brand-500 text-white flex-shrink-0">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Bot size={18} /> AI Teacher
            </div>
            <button onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-slate-400 mt-8">
                <Bot size={32} className="mx-auto mb-3 text-brand-300" />
                Ask me anything about this lesson, or how to get started making money online!
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-brand-500 text-white rounded-br-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-md'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-md">
                  <Loader2 size={16} className="animate-spin text-brand-500" />
                </div>
              </div>
            )}

            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          </div>

          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="w-11 h-11 flex items-center justify-center bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
