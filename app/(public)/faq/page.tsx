import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FAQAccordion from '@/components/faq/FAQAccordion'

export const metadata = {
  title: 'FAQ | M.S Sultan Academy',
  description: 'Frequently asked questions about M.S Sultan Academy courses, payments, and certificates.',
}

const faqs = [
  {
    question: 'Do I need a laptop to take these courses?',
    answer:
      'No! Every course on M.S Sultan Academy is optimized for smartphones. You can learn, watch videos, download resources, and take quizzes entirely from your phone.',
  },
  {
    question: 'Are the courses really free?',
    answer:
      'Yes, we have several completely free courses. We also offer premium courses and subscription plans (Basic and Pro) for more advanced content.',
  },
  {
    question: 'How do I get a certificate?',
    answer:
      'Complete all lessons and pass the quizzes in a course, and your certificate is automatically generated and available for download in your dashboard.',
  },
  {
    question: 'How does the referral program work?',
    answer:
      'Share your unique referral link with friends. When someone signs up using your link and makes a purchase, you earn 10% of that purchase as a reward.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We use Paystack, which supports debit/credit cards, bank transfers, and USSD — all common payment methods across Nigeria and Africa.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, subscriptions are billed monthly with no long-term lock-in. You can manage your plan anytime from your dashboard.',
  },
]

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 min-h-[60vh]">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Frequently Asked Questions</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Everything you need to know before getting started.
          </p>
        </div>
        <FAQAccordion faqs={faqs} />
      </main>
      <Footer />
    </>
  )
}
