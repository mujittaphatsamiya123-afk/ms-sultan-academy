import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { getAllBlogPostsAdmin } from '@/lib/queries/admin-blog'

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Blog</h1>
        <Link href="/admin/blog/new" className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-3 rounded-xl">
          <Plus size={18} /> New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 dark:border-slate-800/50">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-slate-500">{p.category || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.is_published ? 'bg-brand-500/10 text-brand-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${p.id}`} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 inline-flex"><Pencil size={14} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {posts.length === 0 && <p className="text-center py-10 text-slate-400 text-sm">No blog posts yet</p>}
      </div>
    </div>
  )
}
