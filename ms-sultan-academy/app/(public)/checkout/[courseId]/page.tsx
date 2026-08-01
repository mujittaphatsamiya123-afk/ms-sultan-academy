import { redirect, notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import CheckoutCard from '@/components/checkout/CheckoutCard'
import { createClient } from '@/lib/supabase/server'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/checkout/${courseId}`)

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, thumbnail_url, price, is_free')
    .eq('id', courseId)
    .single()

  if (!course || course.is_free) notFound()

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-10">
        <CheckoutCard
          courseId={course.id}
          title={course.title}
          thumbnail={course.thumbnail_url}
          price={Number(course.price)}
        />
      </main>
    </>
  )
}
