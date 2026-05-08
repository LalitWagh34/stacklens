import { NextRequest, NextResponse } from 'next/server'
import { runAudit } from '@/lib/audit-engine'
import { supabase } from '@/lib/supabase'
import { AuditInput } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const input: AuditInput = await req.json()

    // Run the audit engine
    const result = runAudit(input)

    // Save to Supabase
    const { data, error } = await supabase
      .from('audits')
      .insert({
        tools: input.tools,
        team_size: input.teamSize,
        use_case: input.useCase,
        results: result.results,
        total_monthly_savings: result.totalMonthlySavings,
        total_annual_savings: result.totalAnnualSavings,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      // Still return result even if DB fails
      return NextResponse.json({ ...result, id: 'local' })
    }

    return NextResponse.json({ ...result, id: data.id })
  } catch (err) {
    console.error('Audit error:', err)
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 })
  }
}