import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { AuditResult } from '@/types'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

function generateFallbackSummary(audit: AuditResult): string {
  const { totalMonthlySavings, input } = audit
  if (totalMonthlySavings < 100) {
    return `Your AI stack of ${input.tools.length} tool(s) is well-optimized for your ${input.useCase} use case. You're spending efficiently with minimal waste detected. Keep monitoring as new plans and alternatives emerge in the fast-moving AI tools market.`
  }
  return `Your team of ${input.teamSize} is spending on ${input.tools.length} AI tool(s) with $${totalMonthlySavings}/month in potential savings identified. The biggest opportunities are plan mismatches — you're paying for capacity you're not using. Switching or downgrading the flagged tools could save you $${audit.totalAnnualSavings} annually.`
}

export async function POST(req: NextRequest) {
  try {
    const audit: AuditResult = await req.json()

    const topSavings = audit.results
      .filter(r => r.recommendation.monthlySavings > 0)
      .sort((a, b) => b.recommendation.monthlySavings - a.recommendation.monthlySavings)
      .slice(0, 3)
      .map(r => `${r.tool} (${r.plan}): ${r.recommendation.description} — saves $${r.recommendation.monthlySavings}/mo`)
      .join('\n')

    const prompt = `You are an AI spend analyst. Write a 80-100 word personalized audit summary for a team.

Team details:
- Team size: ${audit.input.teamSize}
- Primary use case: ${audit.input.useCase}
- Tools audited: ${audit.input.tools.length}
- Total monthly savings identified: $${audit.totalMonthlySavings}

Top recommendations:
${topSavings || 'Stack is well optimized'}

Write a concise, specific, professional summary. Mention the biggest saving opportunity by name. End with one actionable next step. Do not use bullet points. Plain paragraph only.`

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 150,
      temperature: 0.7,
    })

    const summary = completion.choices[0]?.message?.content?.trim()

    if (!summary) {
      return NextResponse.json({ summary: generateFallbackSummary(audit) })
    }

    return NextResponse.json({ summary })
  } catch (err) {
    console.error('Summary generation failed:', err)
    // Graceful fallback
    const audit: AuditResult = await req.json().catch(() => ({ 
      totalMonthlySavings: 0, 
      input: { tools: [], teamSize: 1, useCase: 'mixed' },
      results: [],
      totalAnnualSavings: 0
    }))
    return NextResponse.json({ summary: generateFallbackSummary(audit) })
  }
}