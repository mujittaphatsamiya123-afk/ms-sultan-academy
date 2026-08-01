import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { fulfillPayment } from '@/lib/payments/fulfill'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  const expectedSignature = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)

  if (event.event === 'charge.success') {
    await fulfillPayment(event.data.reference, event.data.metadata)
  }

  return NextResponse.json({ received: true })
}
