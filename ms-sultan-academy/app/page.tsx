import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import FeaturesGrid from '@/components/home/FeaturesGrid'
import HowItWorks from '@/components/home/HowItWorks'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturesGrid />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
