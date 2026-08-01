'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateCertificate } from '@/lib/certificates/generate'
import { sendEmail, emailTemplate } from '@/lib/email/send'

export async function markLessonComplete(lessonId: string, courseId: string, courseSlug: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  await supabase.from('lesson_progress').upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      is_completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,lesson_id' }
  )

  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId)

  const { data: completedLessons } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', user.id)
    .eq('is_completed', true)
    .in('lesson_id', (allLessons || []).map((l) => l.id))

  const total = allLessons?.length || 1
  const completedCount = completedLessons?.length || 0
  const percentage = Math.round((completedCount / total) * 100)
  const isFullyComplete = completedCount === total

  await supabase
    .from('enrollments')
    .update({
      progress_percentage: percentage,
      completed: isFullyComplete,
      completed_at: isFullyComplete ? new Date().toISOString() : null,
    })
    .eq('student_id', user.id)
    .eq('course_id', courseId)

  if (isFullyComplete) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    const { data: course } = await supabase
      .from('courses')
      .select('title')
      .eq('id', courseId)
      .single()

    if (profile && course) {
      await generateCertificate({
        studentId: user.id,
        studentName: profile.full_name || 'Student',
        courseId,
        courseTitle: course.title,
      })
    }

    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Course Completed! 🎉',
      message: 'Congratulations! Your certificate is ready to download.',
    })

    if (user.email && course) {
      await sendEmail({
        to: user.email,
        subject: 'Course Completed! 🎉',
        html: emailTemplate(
          'Congratulations!',
          `You've completed "${course.title}". Your certificate is ready to download.`,
          'View Certificate',
          `${process.env.NEXT_PUBLIC_APP_URL}/student/certificates`
        ),
      })
    }
  }

  revalidatePath(`/student/courses/${courseSlug}/lesson/${lessonId}`)
  revalidatePath('/student')

  return { success: true, isFullyComplete, percentage }
}

export async function submitQuizAttempt(
  quizId: string,
  answers: { questionId: string; selectedOption: number }[]
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('pass_percentage')
    .eq('id', quizId)
    .single()

  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('id, correct_option')
    .eq('quiz_id', quizId)

  if (!questions || questions.length === 0) return { error: 'No questions found' }

  let correctCount = 0
  questions.forEach((q) => {
    const userAnswer = answers.find((a) => a.questionId === q.id)
    if (userAnswer && userAnswer.selectedOption === q.correct_option) {
      correctCount++
    }
  })

  const score = Math.round((correctCount / questions.length) * 100)
  const passed = score >= (quiz?.pass_percentage || 70)

  await supabase.from('quiz_attempts').insert({
    quiz_id: quizId,
    student_id: user.id,
    score,
    passed,
  })

  return { success: true, score, passed, correctCount, total: questions.length }
}
