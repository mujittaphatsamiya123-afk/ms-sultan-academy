import { notFound } from 'next/navigation'
import { getQuizWithQuestionsAdmin } from '@/lib/queries/quizzes'
import QuizEditor from '@/components/dashboard/admin/quiz-builder/QuizEditor'

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const { quiz, questions } = await getQuizWithQuestionsAdmin(quizId)
  if (!quiz) notFound()

  return <QuizEditor quiz={quiz as any} initialQuestions={questions as any} />
}
