import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BlogCard from '@/components/blog/BlogCard'
import { getPublishedBlogPosts } from '@/lib/queries/blog'

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts()

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 min-h-[60vh]">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Blog</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Tips, guides, and success stories for making money online.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center py-20 text-slate-400">No blog posts published yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <BlogCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt || post.content?.slice(0, 120) + '...'}
                coverImage={post.cover_image_url}
                authorName={post.author?.full_name || 'M.S Sultan Academy'}
                date={post.created_at}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
