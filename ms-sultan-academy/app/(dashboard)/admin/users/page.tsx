import { getAllUsersAdmin } from '@/lib/queries/admin-users'
import UsersManager from '@/components/dashboard/admin/UsersManager'

export default async function AdminUsersPage() {
  const users = await getAllUsersAdmin()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Users</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{users.length} total accounts</p>
      </div>
      <UsersManager users={users as any} />
    </div>
  )
}
