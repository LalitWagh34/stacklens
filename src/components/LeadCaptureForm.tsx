'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  auditId: string
  isOptimal: boolean
}

export default function LeadCaptureForm({ auditId, isOptimal }: Props) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId, email, company, role }),
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="bg-slate-900 border-slate-800 text-center">
        <CardContent className="py-8">
          <p className="text-emerald-400 font-semibold text-lg">✓ Report sent to your inbox</p>
          <p className="text-slate-400 text-sm mt-2">We&apos;ll reach out if we spot more savings for your stack.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white text-base">
          {isOptimal ? 'Get notified when new optimizations apply' : 'Get the full report in your inbox'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Email *</Label>
          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Company (optional)</Label>
            <Input
              placeholder="Acme Inc"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Role (optional)</Label>
            <Input
              placeholder="CTO, Founder..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>
        {/* Honeypot - hidden from real users */}
        <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} />
        <Button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
        >
          {loading ? 'Sending...' : 'Send me the report →'}
        </Button>
        <p className="text-slate-600 text-xs text-center">No spam. Unsubscribe anytime.</p>
      </CardContent>
    </Card>
  )
}