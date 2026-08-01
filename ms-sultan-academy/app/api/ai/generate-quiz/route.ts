import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/ai/client'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { lessonContent, numQuestions = 5, difficulty = 'beginner' } = await request.json()

  if (!lessonContent || lessonContent.length < 20) {
    return NextResponse.json({ error: 'Provide more lesson content to generate from.' }, { status: 400 })
  }

  const prompt = `Based on the following lesson content, generate exactly ${numQuestions} multiple-choice quiz questions at ${difficulty} difficulty.

Lesson content:
"""${lessonContent.slice(0, 6000)}"""

Respond with ONLY valid JSON (no markdown fences, no preamble), matching this exact shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctOption": 0,
      "explanation": "string"
    }
  ]
}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const raw = textBlock && textBlock.type === 'text' ? textBlock.text : '{}'
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json({ questions: parsed.questions || [] })
  } catch (err) {
    console.error('AI quiz generation error:', err)
    return NextResponse.json({ error: 'Failed to generate quiz questions.' }, { status: 500 })
  }
}
