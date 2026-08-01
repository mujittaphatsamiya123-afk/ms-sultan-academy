import { notFound } from 'next/navigation'
import { getBlogPostByIdAdmin } from '@/lib/queries/admin-blog'
import BlogPostEditor from '@/components/dashboard/admin/BlogPostEditor'

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ postId: string }>
}) {
  const { postId } = await params
  const post = await getBlogPostByIdAdmin(postId)
  if (!post) notFound()

  return <BlogPostEditor post={post as any} />
}
