import { getCategories } from '@/lib/queries/courses'
import CourseForm from '@/components/dashboard/admin/CourseForm'

export default async function NewCoursePage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Create New Course</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Fill in the details, then add lessons on the next page.
        </p>
      </div>
      <CourseForm categories={categories} />
    </div>
  )
}
