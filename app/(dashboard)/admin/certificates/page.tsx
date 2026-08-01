import { getAllCertificatesAdmin } from '@/lib/queries/admin-certificates'
import CertificatesManager from '@/components/dashboard/admin/CertificatesManager'

export default async function AdminCertificatesPage() {
  const certificates = await getAllCertificatesAdmin()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Certificates</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{certificates.length} certificates issued</p>
      </div>
      <CertificatesManager certificates={certificates as any} />
    </div>
  )
}
