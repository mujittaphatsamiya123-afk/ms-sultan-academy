'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2, Award } from 'lucide-react'
import { submitQuizAttempt } from '@/lib/actions/progress'

interface Question {
  id: string
  question: string
  options: string[]
  correct_option: number
  explanation?: string | null
}

export default function QuizPlayer({
  quizId,
  title,
  questions,
  passPercentage,
  onPassed,
}: {
  quizId: string
  title: string
  questions: Question[]
  passPercentage: number
  onPassed?: () => void
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{
    score: number
    passed: boolean
    correctCount: number
    total: number
  } | null>(null)
  const [showExplanations, setShowExplanations] = useState(false)

  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  const handleSubmit = async () => {
    setSubmitting(true)
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }))

    const res = await submitQuizAttempt(quizId, formattedAnswers)
    setSubmitting(false)

    if (res.success) {
      setResult(res as any)
      setShowExplanations(true)
      if (res.passed && onPassed) onPassed()
    }
  }

  const handleRetry = () => {
    setResult(null)
    setAnswers({})
    setShowExplanations(false)
  }

  if (result) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              result.passed ? 'bg-brand-500/10 text-brand-600' : 'bg-red-50 text-red-500'
            }`}
          >
            {result.passed ? <Award size={32} /> : <XCircle size={32} />}
          </div>
          <h3 className="text-xl font-bold mb-1">
            {result.passed ? 'Quiz Passed! 🎉' : 'Not Quite There'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            You scored {result.score}% ({result.correctCount}/{result.total} correct). Passing score
            is {passPercentage}%.
          </p>
          {!result.passed && (
            <button
              onClick={handleRetry}
              className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Try Again
            </button>
          )}
        </div>

        {showExplanations && (
          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-5">
            {questions.map((q, i) => {
              const userAnswer = answers[q.id]
              const isCorrect = userAnswer === q.correct_option
              return (
                <div key={q.id} className="text-sm">
                  <p className="font-semibold mb-1 flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 size={14} className="text-brand-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-red-500 flex-shrink-0" />
                    )}
                    {i + 1}. {q.question}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 ml-6">
                    Correct answer: {q.options[q.correct_option]}
                  </p>
                  {q.explanation && (
                    <p className="text-slate-400 ml-6 mt-1 italic">{q.explanation}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Answer all questions below and submit to test your understanding.
      </p>

      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={q.id}>
            <p className="font-semibold mb-3">
              {i + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option, idx) => {
                const selected = answers[q.id] === idx
                return (
                  <button
                    key={idx}
                    onClick={() => setAnswers({ ...answers, [q.id]: idx })}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors flex items-center gap-3 ${
                      selected
                        ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-400'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {selected ? (
                      <CheckCircle2 size={16} className="text-brand-500 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                    )}
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || submitting}
        className="w-full mt-6 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all"
      >
        {submitting && <Loader2 size={18} className="animate-spin" />}
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </div>
  )
}
