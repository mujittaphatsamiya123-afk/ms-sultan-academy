const steps = [
  { number: '01', title: 'Sign Up Free', desc: 'Create your account in under a minute — no card needed.' },
  { number: '02', title: 'Pick a Course', desc: 'Choose from categories like freelancing, AI, and digital skills.' },
  { number: '03', title: 'Learn & Practice', desc: 'Watch video lessons, download resources, take quizzes.' },
  { number: '04', title: 'Earn & Get Certified', desc: 'Apply your skills to start earning, then get certified.' },
]

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">How It Works</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Four simple steps from beginner to earning online.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              <div className="text-5xl font-extrabold text-brand-500/15 mb-2">
                {step.number}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 -right-4 w-8 h-px bg-slate-300 dark:bg-slate-700" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
