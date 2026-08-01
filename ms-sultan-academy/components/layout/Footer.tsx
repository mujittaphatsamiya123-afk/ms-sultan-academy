import Link from 'next/link'
import { GraduationCap, Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 font-bold text-white text-lg mb-4">
              <span className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
                <GraduationCap size={20} />
              </span>
              M.S Sultan Academy
            </div>
            <p className="text-sm text-slate-400">
              Practical online courses helping beginners in Nigeria & Africa
              earn money using smartphones and AI.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-brand-400">Courses</Link></li>
              <li><Link href="/blog" className="hover:text-brand-400">Blog</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-400">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-brand-400">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-brand-400">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-brand-500 transition-colors"><Facebook size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-brand-500 transition-colors"><Twitter size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-brand-500 transition-colors"><Instagram size={16} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} M.S Sultan Academy. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
