'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { addQuestion, reorderQuestions } from '@/lib/actions/quiz-builder'
import SortableQuestionCard from './SortableQuestionCard'
import AIGenerateButton from './AIGenerateButton'

interface Question {
  id: string
  question: string
  options: string[]
  correct_option: number
  explanation: string | null
  position: number
}

export default function QuestionList({
  quizId,
  initialQuestions,
}: {
  quizId: string
  initialQuestions: Question[]
}) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [adding, setAdding] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = questions.findIndex((q) => q.id === active.id)
    const newIndex = questions.findIndex((q) => q.id === over.id)
    const reordered = arrayMove(questions, oldIndex, newIndex)
    setQuestions(reordered)

    await reorderQuestions(quizId, reordered.map((q) => q.id))
  }

  const handleAddQuestion = async () => {
    setAdding(true)
    const result = await addQuestion({
      quizId,
      question: 'New question — click to edit',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOption: 0,
      explanation: '',
      position: questions.length,
    })
    setAdding(false)
    if (result.data) {
      setQuestions([...questions, result.data])
    }
  }

  const handleDeleteLocal = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleUpdateLocal = (id: string, updates: Partial<Question>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Questions ({questions.length})</h2>
        <p className="text-xs text-slate-400">Drag the handle to reorder</p>
      </div>

      <AIGenerateButton
        quizId={quizId}
        startPosition={questions.length}
        onGenerated={(newQs) => setQuestions((prev) => [...prev, ...newQs])}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {questions.map((q, i) => (
              <SortableQuestionCard
                key={q.id}
                question={q}
                index={i}
                quizId={quizId}
                onDeleted={() => handleDeleteLocal(q.id)}
                onUpdated={(updates) => handleUpdateLocal(q.id, updates)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={handleAddQuestion}
        disabled={adding}
        className="w-full mt-4 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-400 text-slate-500 hover:text-brand-600 font-medium py-4 rounded-2xl transition-colors disabled:opacity-50"
      >
        <Plus size={18} /> {adding ? 'Adding...' : 'Add Question'}
      </button>
    </div>
  )
}
