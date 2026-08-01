import { LucideIcon } from 'lucide-react'

export default function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'brand',
}: {
  icon: LucideIcon
  label: string
  value: string | number
  accent?: 'brand' | 'gold'
}) {
  const bg = accent === 'gold' ? 'bg-gold-500/10 text-gold-600' : 'bg-brand-500/10 text-brand-600'

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}
