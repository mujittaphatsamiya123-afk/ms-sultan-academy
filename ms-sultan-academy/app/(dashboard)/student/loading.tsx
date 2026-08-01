export default function StudentDashboardLoading() {
  return (
    <div>
      <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2 animate-pulse" />
      <div className="h-4 w-80 bg-slate-200 dark:bg-slate-800 rounded mb-8 animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
