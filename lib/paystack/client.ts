const PAYSTACK_BASE_URL = 'https://api.paystack.co'

export async function initializeTransaction({
  email,
  amount,
  reference,
  metadata,
}: {
  email: string
  amount: number
  reference: string
  metadata: Record<string, any>
}) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100),
      reference,
      metadata,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify`,
    }),
  })

  return response.json()
}

export async function verifyTransaction(reference: string) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })

  return response.json()
}
