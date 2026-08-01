import { Mail, MessageCircle, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/contact/ContactForm'

export const metadata = {
  title: 'Contact Us | M.S Sultan Academy',
  description: 'Get in touch with M.S Sultan Academy support.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 min-h-[60vh]">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Get In Touch</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Have a question? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">
              <span className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                <Mail size={20} />
              </span>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-semibold">support@mssultanacademy.com</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">
              <span className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                <MessageCircle size={20} />
              </span>
              <div>
                <p className="text-sm text-slate-500">WhatsApp Support</p>
                <p className="font-semibold">Available 9am - 6pm WAT</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">
              <span className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                <MapPin size={20} />
              </span>
              <div>
                <p className="text-sm text-slate-500">Based In</p>
                <p className="font-semibold">Nigeria, serving all of Africa</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
