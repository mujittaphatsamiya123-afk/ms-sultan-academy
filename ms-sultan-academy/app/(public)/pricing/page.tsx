import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PricingCard from '@/components/checkout/PricingCard'
import { createClient } from '@/lib/supabase/server'

const plans = [
  {
    plan: 'free' as const,
    name: 'Free',
    price: 0,
    features: ['Access to free courses', 'Basic AI tool recommendations', 'Community support'],
  },
  {
    plan: 'basic' as const,
    name: 'Basic',
    price: 3500,
    features: [
      'Everything in Free',
      'Access to all Basic-tier courses',
      'Downloadable resources',
      'Certificates of completion',
    ],
    highlighted: true,
  },
  {
    plan: 'pro' as const,
    name: 'Pro',
    price: 7500,
    features: [
      'Everything in Basic',
      'Access to ALL courses',
      'Priority support',
      'Early access to new courses',
      'Advanced AI tools guide',
    ],
  },
]

export default async function PricingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let currentPlan = 'free'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_plan')
      .eq('id', user.id)
      .single()
    currentPlan = profile?.subscription_plan || 'free'
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Simple, Affordable Pricing
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Plans built for Naira budgets — upgrade anytime as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => (
            <PricingCard key={p.plan} {...p} isLoggedIn={!!user} currentPlan={currentPlan} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
