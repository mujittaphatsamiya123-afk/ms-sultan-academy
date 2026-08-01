import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/ai/client'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { goal, hoursPerWeek, experienceLevel } = await request.json()

  if (!goal || typeof goal !== 'string') {
    return NextResponse.json({ error: 'Please describe your goal.' }, { status: 400 })
  }

  const { data: courses } = await supabase
    .from('courses')
    .select('title, slug, level, category:categories(name)')
    .eq('is_published', true)
    .limit(30)

  const courseList = (courses || []).map((c: any) => `- ${c.title} (${c.level}, ${c.category?.name || 'General'})`).join('\n')

  const prompt = `A student on M.S Sultan Academy wants a personalized study plan.

Goal: ${goal}
Available time: ${hoursPerWeek || 'not specified'} hours per week
Experience level: ${experienceLevel || 'beginner'}

Available courses on the platform:
${courseList || 'No courses available yet.'}

Create a realistic, encouraging 4-week study plan using ONLY the courses listed above (recommend by exact title). Keep it concise, using short sections per week. Format as plain text with clear week headers, no markdown symbols.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const plan = textBlock && textBlock.type === 'text' ? textBlock.text : ''

    return NextResponse.json({ plan })
  } catch (err) {
    console.error('AI study plan error:', err)
    return NextResponse.json({ error: 'Failed to generate a study plan.' }, { status: 500 })
  }
}
