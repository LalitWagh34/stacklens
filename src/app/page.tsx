'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Trash2, Zap } from 'lucide-react'
import { AuditInput, ToolInput, ToolName, UseCase } from '@/types'
import dynamic from 'next/dynamic'

const TOOLS: { value: ToolName; label: string }[] = [
  { value: 'cursor', label: 'Cursor' },
  { value: 'github-copilot', label: 'GitHub Copilot' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'anthropic-api', label: 'Anthropic API' },
  { value: 'openai-api', label: 'OpenAI API' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'windsurf', label: 'Windsurf' },
]

const PLANS: Record<ToolName, string[]> = {
  cursor: ['Hobby', 'Pro', 'Business', 'Enterprise'],
  'github-copilot': ['Individual', 'Business', 'Enterprise'],
  claude: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API Direct'],
  chatgpt: ['Free', 'Plus', 'Team', 'Enterprise', 'API Direct'],
  'anthropic-api': ['Pay as you go'],
  'openai-api': ['Pay as you go'],
  gemini: ['Free', 'Pro', 'Ultra', 'API'],
  windsurf: ['Free', 'Pro', 'Team', 'Enterprise'],
}

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: 'Coding / Engineering' },
  { value: 'writing', label: 'Writing / Content' },
  { value: 'data', label: 'Data Analysis' },
  { value: 'research', label: 'Research' },
  { value: 'mixed', label: 'Mixed / General' },
]

const defaultTool: ToolInput = {
  tool: 'cursor',
  plan: 'Pro',
  monthlySpend: 0,
  seats: 1,
}

const STORAGE_KEY = 'stacklens_form'

export default function Home() {
  const router = useRouter()
  const [tools, setTools] = useState<ToolInput[]>([{ ...defaultTool }])
  const [teamSize, setTeamSize] = useState(1)
  const [useCase, setUseCase] = useState<UseCase>('coding')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setTools(parsed.tools ?? [{ ...defaultTool }])
      setTeamSize(parsed.teamSize ?? 1)
      setUseCase(parsed.useCase ?? 'coding')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tools, teamSize, useCase }))
  }, [tools, teamSize, useCase])

  function addTool() {
    setTools([...tools, { ...defaultTool }])
  }

  function removeTool(index: number) {
    setTools(tools.filter((_, i) => i !== index))
  }

  function updateTool(index: number, field: keyof ToolInput, value: string | number) {
    const updated = [...tools]
    if (field === 'tool') {
      updated[index] = {
        ...updated[index],
        tool: value as ToolName,
        plan: PLANS[value as ToolName][0],
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setTools(updated)
  }

  async function handleSubmit() {
    setLoading(true)
    const input: AuditInput = { tools, teamSize, useCase }
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      router.push(`/audit/${data.id}`)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-emerald-400" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-white">StackLens</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Find out exactly where your team is overspending on AI tools — in 2 minutes.
          </p>
          <Badge variant="secondary" className="mt-3">Free • No login required</Badge>
        </div>

        {/* Form */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Your AI Tool Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Team info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team-size" className="text-slate-300">Team Size</Label>
                <Input
                  id="team-size"
                  type="number"
                  min={1}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white"
                  aria-label="Team size"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="use-case" className="text-slate-300">Primary Use Case</Label>
                <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
                  <SelectTrigger
                    id="use-case"
                    className="bg-slate-800 border-slate-700 text-white"
                    aria-label="Primary use case"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USE_CASES.map((u) => (
                      <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <Label className="text-slate-300 mb-4 block">AI Tools You Pay For</Label>
              <div className="space-y-4">
                {tools.map((tool, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3 space-y-1">
                      <Label htmlFor={`tool-${index}`} className="text-slate-400 text-xs">Tool</Label>
                      <Select
                        value={tool.tool}
                        onValueChange={(v) => updateTool(index, 'tool', v)}
                      >
                        <SelectTrigger
                          id={`tool-${index}`}
                          className="bg-slate-800 border-slate-700 text-white"
                          aria-label={`Tool ${index + 1}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TOOLS.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3 space-y-1">
                      <Label htmlFor={`plan-${index}`} className="text-slate-400 text-xs">Plan</Label>
                      <Select
                        value={tool.plan}
                        onValueChange={(v) => updateTool(index, 'plan', v)}
                      >
                        <SelectTrigger
                          id={`plan-${index}`}
                          className="bg-slate-800 border-slate-700 text-white"
                          aria-label={`Plan for tool ${index + 1}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLANS[tool.tool].map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label htmlFor={`spend-${index}`} className="text-slate-400 text-xs">$/month</Label>
                      <Input
                        id={`spend-${index}`}
                        type="number"
                        min={0}
                        value={tool.monthlySpend}
                        onChange={(e) => updateTool(index, 'monthlySpend', Number(e.target.value))}
                        className="bg-slate-800 border-slate-700 text-white"
                        aria-label={`Monthly spend for tool ${index + 1}`}
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label htmlFor={`seats-${index}`} className="text-slate-400 text-xs">Seats</Label>
                      <Input
                        id={`seats-${index}`}
                        type="number"
                        min={1}
                        value={tool.seats}
                        onChange={(e) => updateTool(index, 'seats', Number(e.target.value))}
                        className="bg-slate-800 border-slate-700 text-white"
                        aria-label={`Number of seats for tool ${index + 1}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTool(index)}
                        disabled={tools.length === 1}
                        className="text-slate-400 hover:text-red-400"
                        aria-label={`Remove tool ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={addTool}
                className="mt-4 border-slate-700 text-slate-300 hover:bg-slate-800"
                aria-label="Add another tool"
              >
                <PlusCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                Add another tool
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-6 text-lg"
              aria-label="Run free audit"
            >
              {loading ? 'Analyzing your stack...' : 'Run Free Audit →'}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-slate-600 text-sm mt-6">
          No account needed. Your data is never sold.
        </p>
      </div>
    </main>
  )
}