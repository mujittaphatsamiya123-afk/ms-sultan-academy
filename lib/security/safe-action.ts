export async function safeAction<T>(fn: () => Promise<T>): Promise<T | { error: string }> {
  try {
    return await fn()
  } catch (err) {
    console.error('Server action error:', err)
    return { error: 'Something went wrong. Please try again.' } as T | { error: string }
  }
}
