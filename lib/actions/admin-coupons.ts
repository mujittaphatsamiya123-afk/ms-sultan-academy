'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createCoupon(data: {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxUses: number | null
  expiresAt: string | null
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('coupons').insert({
    code: data.code.toUpperCase().trim(),
    discount_type: data.discountType,
    discount_value: data.discountValue,
    max_uses: data.maxUses,
    expires_at: data.expiresAt,
  })
  if (error) return { error: error.code === '23505' ? 'Coupon code already exists' : error.message }
  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function toggleCoupon(id: string, isActive: boolean) {
  const supabase = await createClient()
  await supabase.from('coupons').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient()
  await supabase.from('coupons').delete().eq('id', id)
  revalidatePath('/admin/coupons')
  return { success: true }
}
