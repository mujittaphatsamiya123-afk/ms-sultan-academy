import { getAllLessonsForQuizAssignment } from '@/lib/queries/quizzes'
import NewQuizForm from '@/components/dashboard/admin/NewQuizForm'

export default async function NewQuizPage() {
  const lessons = await getAllLessonsForQuizAssignment()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Create New Quiz</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Set up the quiz details, then add questions on the next page.
        </p>
      </div>
      <NewQuizForm lessons={lessons as any} />
    </div>
  )
}
