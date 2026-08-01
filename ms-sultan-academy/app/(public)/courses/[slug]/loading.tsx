export default function CourseDetailLoading() {
  return (
    <div>
      <div className="bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950 py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-3 animate-pulse" />
          <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4 animate-pulse" />
          <div className="h-4 w-full max-w-xl bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
