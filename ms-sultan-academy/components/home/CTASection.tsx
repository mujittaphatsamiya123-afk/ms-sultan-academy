import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 px-6 py-14 sm:px-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Start Earning Online?
          </h2>
          <p className="text-brand-50 mb-8 max-w-xl mx-auto">
            Join thousands of students already learning practical skills to
            make money using their phones and AI tools.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-8 py-4 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            Join Free Today <ArrowRight size={18} />
          </Link>

          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold-400/20 rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  )
}
