import { Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStudentCertificates } from '@/lib/queries/certificates'
import CertificateCard from '@/components/certificates/CertificateCard'

export default async function StudentCertificatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const certificates = await getStudentCertificates(user!.id)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Certificates</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <Award className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-semibold mb-1">No certificates yet</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Complete a course to earn your first certificate.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert: any) => (
            <CertificateCard
              key={cert.id}
              courseTitle={cert.course?.title || 'Course'}
              thumbnail={cert.course?.thumbnail_url}
              issuedAt={cert.issued_at}
              certificateUrl={cert.certificate_url}
            />
          ))}
        </div>
      )}
    </div>
  )
}
