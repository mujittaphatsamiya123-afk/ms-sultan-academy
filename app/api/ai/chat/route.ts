import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { anthropic, AI_TEACHER_SYSTEM_PROMPT } from '@/lib/ai/client'
import { aiRateLimit, getClientIp } from '@/lib/security/rate-limit'
import { chatMessageSchema } from '@/lib/validations/api'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await request.json()
  const parsed = chatMessageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const { message, courseId, lessonContext } = parsed.data

  const ip = getClientIp(request)
  const { success } = await aiRateLimit.limit(`${user.id}:${ip}`)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 })
  }

  const { data: history } = await supabase
    .from('ai_chat_messages')
    .select('role, content')
    .eq('student_id', user.id)
    .eq('course_id', courseId || null)
    .order('created_at', { ascending: true })
    .limit(10)

  await supabase.from('ai_chat_messages').insert({
    student_id: user.id,
    course_id: courseId || null,
    role: 'user',
    content: message,
  })

  const systemPrompt = lessonContext
    ? `${AI_TEACHER_SYSTEM_PROMPT}\n\nThe student is currently on this lesson:\n"""${lessonContext.slice(0, 2000)}"""\nUse it to ground your answer when relevant.`
    : AI_TEACHER_SYSTEM_PROMPT

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: systemPrompt,
      messages: [
        ...(history || []).map((h) => ({ role: h.role as 'user' | 'assistant', content: h.content })),
        { role: 'user', content: message },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const reply = textBlock && textBlock.type === 'text' ? textBlock.text : 'Sorry, I could not generate a response.'

    await supabase.from('ai_chat_messages').insert({
      student_id: user.id,
      course_id: courseId || null,
      role: 'assistant',
      content: reply,
    })

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('AI teacher error:', err)
    return NextResponse.json({ error: 'AI Teacher is temporarily unavailable.' }, { status: 500 })
  }
}
