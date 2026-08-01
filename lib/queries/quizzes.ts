import { createClient } from '@/lib/supabase/server'

export async function getAllQuizzesAdmin() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('quizzes')
    .select('id, title, description, category, difficulty, time_limit_minutes, is_published, pass_percentage, lesson_id, quiz_questions(count)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getQuizWithQuestionsAdmin(quizId: string) {
  const supabase = await createClient()
  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', quizId).single()
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('position', { ascending: true })
  return { quiz, questions: questions || [] }
}

export async function getAllLessonsForQuizAssignment() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('lessons')
    .select('id, title, course:courses(title)')
    .order('position', { ascending: true })
  return data || []
}
