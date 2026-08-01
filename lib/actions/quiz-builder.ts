'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createQuiz(data: {
  title: string
  description: string
  category: string
  difficulty: string
  passPercentage: number
  timeLimitMinutes: number | null
  lessonId: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: quiz, error } = await supabase
    .from('quizzes')
    .insert({
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      pass_percentage: data.passPercentage,
      time_limit_minutes: data.timeLimitMinutes,
      lesson_id: data.lessonId,
      created_by: user.id,
      is_published: false,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/admin/quizzes')
  return { data: quiz }
}

export async function autosaveQuiz(quizId: string, updates: Record<string, any>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('quizzes')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', quizId)

  if (error) return { error: error.message }
  revalidatePath(`/admin/quizzes/${quizId}`)
  return { success: true, savedAt: new Date().toISOString() }
}

export async function deleteQuiz(quizId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('quizzes').delete().eq('id', quizId)
  if (error) return { error: error.message }
  revalidatePath('/admin/quizzes')
  return { success: true }
}

export async function togglePublishQuiz(quizId: string, isPublished: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('quizzes')
    .update({ is_published: isPublished })
    .eq('id', quizId)
  if (error) return { error: error.message }
  revalidatePath('/admin/quizzes')
  return { success: true }
}

export async function addQuestion(data: {
  quizId: string
  question: string
  options: string[]
  correctOption: number
  explanation: string
  position: number
}) {
  const supabase = await createClient()
  const { data: q, error } = await supabase
    .from('quiz_questions')
    .insert({
      quiz_id: data.quizId,
      question: data.question,
      options: data.options,
      correct_option: data.correctOption,
      explanation: data.explanation,
      position: data.position,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath(`/admin/quizzes/${data.quizId}`)
  return { data: q }
}

export async function updateQuestion(questionId: string, quizId: string, updates: Record<string, any>) {
  const supabase = await createClient()
  const { error } = await supabase.from('quiz_questions').update(updates).eq('id', questionId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/quizzes/${quizId}`)
  return { success: true, savedAt: new Date().toISOString() }
}

export async function deleteQuestion(questionId: string, quizId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('quiz_questions').delete().eq('id', questionId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/quizzes/${quizId}`)
  return { success: true }
}

export async function reorderQuestions(quizId: string, orderedIds: string[]) {
  const supabase = await createClient()
  const updates = orderedIds.map((id, index) =>
    supabase.from('quiz_questions').update({ position: index }).eq('id', id)
  )
  await Promise.all(updates)
  revalidatePath(`/admin/quizzes/${quizId}`)
  return { success: true }
}
