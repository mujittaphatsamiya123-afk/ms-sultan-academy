import AuthCard from '@/components/auth/AuthCard'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthCard title="Welcome Back" subtitle="Log in to continue your learning journey.">
      <LoginForm />
    </AuthCard>
  )
}
