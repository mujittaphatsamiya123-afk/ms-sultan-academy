'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ShieldCheck, ShieldX, UserPlus, Loader2, X } from 'lucide-react'
import { updateUserRole, suspendUser, reinstateUser, inviteAdmin } from '@/lib/actions/admin-users'

interface User {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  role: string
  subscription_plan: string
  is_suspended: boolean
  suspended_reason: string | null
  created_at: string
}

export default function UsersManager({ users }: { users: User[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null)
  const [suspendReason, setSuspendReason] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState(false)

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  )

  const handleRoleToggle = async (user: User) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin'
    if (!confirm(`Change ${user.full_name || user.email} to ${newRole}?`)) return
    setBusyId(user.id)
    const result = await updateUserRole(user.id, newRole)
    setBusyId(null)
    if (result.error) return alert(result.error)
    router.refresh()
  }

  const handleSuspendConfirm = async () => {
    if (!suspendTarget) return
    setBusyId(suspendTarget.id)
    const result = await suspendUser(suspendTarget.id, suspendReason)
    setBusyId(null)
    setSuspendTarget(null)
    setSuspendReason('')
    if (result.error) return alert(result.error)
    router.refresh()
  }

  const handleReinstate = async (user: User) => {
    setBusyId(user.id)
    await reinstateUser(user.id)
    setBusyId(null)
    router.refresh()
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return setInviteError('Email is required')
    setInviteLoading(true)
    setInviteError('')
    const result = await inviteAdmin(inviteEmail, inviteName)
    setInviteLoading(false)
    if (result.error) return setInviteError(result.error)
    setInviteSuccess(true)
    setInviteEmail('')
    setInviteName('')
    router.refresh()
    setTimeout(() => {
      setShowInvite(false)
      setInviteSuccess(false)
    }, 1800)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex-shrink-0"
        >
          <UserPlus size={16} /> Invite Admin
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{u.full_name || '—'}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${u.role === 'admin' ? 'bg-gold-500/10 text-gold-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.is_suspended ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">Suspended</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRoleToggle(u)}
                        disabled={busyId === u.id}
                        title={u.role === 'admin' ? 'Demote to student' : 'Promote to admin'}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                      >
                        {busyId === u.id ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                      </button>
                      {u.is_suspended ? (
                        <button
                          onClick={() => handleReinstate(u)}
                          disabled={busyId === u.id}
                          title="Reinstate account"
                          className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 hover:bg-brand-100"
                        >
                          <ShieldCheck size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSuspendTarget(u)}
                          disabled={busyId === u.id}
                          title="Suspend account"
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
                        >
                          <ShieldX size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-10 text-slate-400 text-sm">No users found</p>}
        </div>
      </div>

      {suspendTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Suspend Account</h3>
              <button onClick={() => setSuspendTarget(null)}><X size={18} /></button>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              Suspending {suspendTarget.full_name || suspendTarget.email} will immediately block their access to the platform.
            </p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Reason (shown to the user)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-red-400 resize-none text-sm mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSuspendConfirm}
                disabled={busyId === suspendTarget.id}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white font-semibold py-2.5 rounded-xl text-sm"
              >
                {busyId === suspendTarget.id && <Loader2 size={14} className="animate-spin" />} Suspend
              </button>
              <button onClick={() => setSuspendTarget(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showInvite && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Invite New Admin</h3>
              <button onClick={() => setShowInvite(false)}><X size={18} /></button>
            </div>

            {inviteSuccess ? (
              <p className="text-brand-600 text-sm font-medium py-4 text-center">Invitation sent!</p>
            ) : (
              <>
                {inviteError && <p className="text-red-500 text-sm mb-3">{inviteError}</p>}
                <div className="space-y-3 mb-4">
                  <input
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
                <button
                  onClick={handleInvite}
                  disabled={inviteLoading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-semibold py-3 rounded-xl text-sm"
                >
                  {inviteLoading && <Loader2 size={14} className="animate-spin" />} Send Invite
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
