export default function AnalyticsChart({
  data,
}: {
  data: { month: string; revenue: number }[]
}) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No data yet
      </div>
    )
  }

  const max = Math.max(...data.map((d) => d.revenue))

  return (
    <div className="flex items-end gap-3 h-64 pt-6 overflow-x-auto">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center gap-2 min-w-[48px]">
          <div className="flex-1 flex items-end w-full">
            <div
              className="w-full bg-brand-500 rounded-t-lg hover:bg-brand-600 transition-colors relative group"
              style={{ height: `${max ? (d.revenue / max) * 100 : 0}%`, minHeight: '4px' }}
            >
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {d.revenue.toLocaleString()}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{d.month}</span>
        </div>
      ))}
    </div>
  )
}
