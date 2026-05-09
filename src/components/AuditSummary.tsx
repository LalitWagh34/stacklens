'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auditData: any
}

export default function AuditSummary({ auditData }: Props) {
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: {
              tools: auditData.tools,
              teamSize: auditData.team_size,
              useCase: auditData.use_case,
            },
            results: auditData.results,
            totalMonthlySavings: auditData.total_monthly_savings,
            totalAnnualSavings: auditData.total_annual_savings,
          }),
        })
        const data = await res.json()
        setSummary(data.summary)
      } catch {
        setSummary(`Your AI stack has been audited. We found $${auditData.total_monthly_savings}/month in potential savings. Review the recommendations below to optimize your spend.`)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [auditData])

  return (
    <Card className="bg-slate-900 border-slate-800 mb-8">
      <CardContent className="py-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">AI Analysis</span>
        </div>
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-slate-800 rounded animate-pulse w-full" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-4/5" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-3/5" />
          </div>
        ) : (
          <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
        )}
      </CardContent>
    </Card>
  )
}