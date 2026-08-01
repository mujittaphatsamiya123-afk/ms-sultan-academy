import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Profile Settings</h1>
      <ProfileForm
        initialFullName={profile?.full_name || ''}
        email={user!.email || ''}
        initialPhone={profile?.phone || ''}
        avatarUrl={profile?.avatar_url}
      />
    </div>
  )
}
