import { Smartphone, Bot, Award, Wallet } from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'Learn on Your Phone',
    desc: 'Every lesson is optimized for mobile — learn anywhere, even with slow data.',
  },
  {
    icon: Bot,
    title: 'AI Tools Included',
    desc: 'Get hands-on with the exact AI tools top earners use — recommended in every course.',
  },
  {
    icon: Award,
    title: 'Real Certificates',
    desc: 'Earn a certificate after every completed course to boost your credibility.',
  },
  {
    icon: Wallet,
    title: 'Affordable Pricing',
    desc: 'Plans built for Naira budgets — start free, upgrade only when ready.',
  },
]

export default function FeaturesGrid() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Why Students Choose M.S Sultan Academy
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Built specifically for beginners in Nigeria & Africa — practical,
            affordable, and mobile-first.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all bg-slate-50/50 dark:bg-slate-900"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                <Icon className="text-brand-500" size={22} />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
