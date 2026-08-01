import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIToolCard from '@/components/ai-tools/AIToolCard'
import { getAllAITools } from '@/lib/queries/ai-tools'

export const metadata = {
  title: 'AI Tools Directory | M.S Sultan Academy',
  description: 'Curated AI tools our top-earning students use every day.',
}

export default async function AIToolsPage() {
  const tools = await getAllAITools()

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 min-h-[60vh]">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">AI Tools Directory</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Curated AI tools our top-earning students use every day.
          </p>
        </div>

        {tools.length === 0 ? (
          <p className="text-center py-20 text-slate-400">No AI tools listed yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <AIToolCard
                key={tool.id}
                name={tool.name}
                description={tool.description}
                logo={tool.logo_url}
                websiteUrl={tool.website_url}
                category={tool.category}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
