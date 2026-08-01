import { NextResponse } from 'next/server'
import { verifyTransaction } from '@/lib/paystack/client'
import { fulfillPayment } from '@/lib/payments/fulfill'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const reference = searchParams.get('reference') || searchParams.get('trxref')

  if (!reference) {
    return NextResponse.redirect(`${origin}/student?payment=error`)
  }

  const result = await verifyTransaction(reference)

  if (result.status && result.data.status === 'success') {
    await fulfillPayment(reference, result.data.metadata)
    return NextResponse.redirect(`${origin}/student?payment=success`)
  }

  return NextResponse.redirect(`${origin}/student?payment=failed`)
}
