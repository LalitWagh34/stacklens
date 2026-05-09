import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, TrendingDown, ArrowRight, CheckCircle } from 'lucide-react'
import { ToolAuditResult } from '@/types'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import AuditSummary from '@/components/AuditSummary'
interface Props {
  params: Promise<{ id: string }>
}

const TOOL_LABELS: Record<string, string> = {
  cursor: 'Cursor',
  'github-copilot': 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  'anthropic-api': 'Anthropic API',
  'openai-api': 'OpenAI API',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
}

const ACTION_COLORS: Record<string, string> = {
  downgrade: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  switch: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  optimize: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  keep: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const ACTION_LABELS: Record<string, string> = {
  downgrade: 'Downgrade',
  switch: 'Switch Tool',
  optimize: 'Optimize',
  keep: '✓ Optimal',
}

export default async function AuditPage({ params }: Props) {
  const { id } = await params

  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return notFound()

  const results: ToolAuditResult[] = data.results
  const totalMonthlySavings = data.total_monthly_savings
  const totalAnnualSavings = data.total_annual_savings
  const isHighSavings = totalMonthlySavings > 500
  const isOptimal = totalMonthlySavings < 100

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <Zap className="w-6 h-6 text-emerald-400" />
          <span className="text-white font-bold text-xl">StackLens Audit</span>
        </div>

        {/* Hero savings */}
        <Card className="bg-slate-900 border-slate-800 mb-8 text-center">
          <CardContent className="py-10">
            {isOptimal ? (
              <>
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">You&apos;re spending well</h2>
                <p className="text-slate-400">Your current AI stack looks well-optimized. We&apos;ll notify you when new savings apply.</p>
              </>
            ) : (
              <>
                <TrendingDown className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">Potential monthly savings</p>
                <p className="text-6xl font-bold text-emerald-400 mb-2">
                  ${totalMonthlySavings.toLocaleString()}
                </p>
                <p className="text-slate-400 text-lg">
                  ${totalAnnualSavings.toLocaleString()} saved per year
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Credex CTA for high savings */}
        {/* Credex CTA for high savings */}
          <AuditSummary auditData={data} />
        {isHighSavings && (
          <Card className="bg-emerald-950 border-emerald-800 mb-8">
            <CardContent className="py-6 flex items-center justify-between">
              <div>
                <p className="text-emerald-300 font-semibold text-lg">Capture even more savings with Credex</p>
                <p className="text-emerald-500 text-sm mt-1">Buy discounted AI credits for Claude, ChatGPT & more — up to 30% off retail</p>
              </div>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm whitespace-nowrap"
              >
                Talk to Credex →
              </a>
            </CardContent>
          </Card>
        )}

        {/* Per tool breakdown */}
        <div className="space-y-4 mb-10">
          <h3 className="text-white font-semibold text-lg">Per-Tool Breakdown</h3>
          {results.map((result, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base">
                    {TOOL_LABELS[result.tool] || result.tool} — {result.plan}
                  </CardTitle>
                  <Badge className={ACTION_COLORS[result.recommendation.action]}>
                    {ACTION_LABELS[result.recommendation.action]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400">
                    Current: <span className="text-white font-medium">${result.currentMonthlySpend}/mo</span>
                  </span>
                  {result.recommendation.monthlySavings > 0 && (
                    <>
                      <ArrowRight className="w-4 h-4 text-slate-600" />
                      <span className="text-emerald-400 font-medium">
                        Save ${result.recommendation.monthlySavings}/mo
                      </span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 text-sm font-medium">
                  {result.recommendation.description}
                </p>
                <p className="text-slate-500 text-xs">
                  {result.recommendation.reason}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lead capture */}
        <LeadCaptureForm auditId={id} isOptimal={isOptimal} />

      </div>
    </main>
  )
}