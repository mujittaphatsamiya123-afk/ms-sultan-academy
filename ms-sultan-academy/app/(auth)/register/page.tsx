import { Suspense } from 'react'
import AuthCard from '@/components/auth/AuthCard'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create Your Free Account"
      subtitle="Start learning how to make money online today."
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  )
}
