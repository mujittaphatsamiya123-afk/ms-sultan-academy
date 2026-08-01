import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import CourseCard from '@/components/courses/CourseCard'

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: wishlist } = await supabase
    .from('wishlist')
    .select('course:courses(id, title, slug, description, thumbnail_url, price, is_free, level, category:categories(name))')
    .eq('student_id', user!.id)

  const courses = (wishlist || []).map((w: any) => w.course).filter(Boolean)

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Wishlist</h1>
      {courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <Heart className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-semibold">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c: any) => (
            <CourseCard key={c.id} courseId={c.id} slug={c.slug} title={c.title} description={c.description}
              thumbnail={c.thumbnail_url} isFree={c.is_free} price={c.price} level={c.level}
              categoryName={c.category?.name} isWishlisted={true} />
          ))}
        </div>
      )}
    </div>
  )
}
