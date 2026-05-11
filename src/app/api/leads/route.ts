import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { auditId, email, company, role } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Honeypot check
    const body = await req.json().catch(() => ({}))
    if (body.website) {
      return NextResponse.json({ success: true }) // silently reject bots
    }

    // Save lead to Supabase
    const { error } = await supabase
      .from('leads')
      .insert({
        audit_id: auditId,
        email,
        company_name: company,
        role,
      })

    if (error) {
      console.error('Lead capture error:', error)
    }

    // Fetch audit data for email
    const { data: audit } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .single()

    const monthlySavings = audit?.total_monthly_savings ?? 0
    const annualSavings = audit?.total_annual_savings ?? 0
    const isHighSavings = monthlySavings > 500

    // Send confirmation email
    await resend.emails.send({
      from: 'StackLens <onboarding@resend.dev>',
      to:  email,
      subject: `Your StackLens Audit — $${monthlySavings}/mo in savings identified`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #10b981; font-size: 24px;">⚡ StackLens Audit Complete</h1>
          
          <p style="color: #334155;">Hi${company ? ` from ${company}` : ''},</p>
          
          <p style="color: #334155;">Your AI spend audit is ready. Here's what we found:</p>
          
          <div style="background: #0f172a; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <p style="color: #94a3b8; margin: 0 0 8px 0;">Potential monthly savings</p>
            <p style="color: #10b981; font-size: 48px; font-weight: bold; margin: 0;">$${monthlySavings}</p>
            <p style="color: #64748b; margin: 8px 0 0 0;">$${annualSavings} saved per year</p>
          </div>

          <p style="color: #334155;">
            View your full audit report with per-tool breakdown and recommendations:
          </p>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}" 
             style="display: inline-block; background: #10b981; color: black; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            View Full Report →
          </a>

          ${isHighSavings ? `
          <div style="margin-top: 32px; padding: 20px; border: 1px solid #10b981; border-radius: 8px;">
            <p style="color: #10b981; font-weight: bold; margin: 0 0 8px 0;">💡 Capture even more savings with Credex</p>
            <p style="color: #64748b; margin: 0 0 12px 0;">Buy discounted AI credits for Claude, ChatGPT & more — up to 30% off retail. A Credex advisor will reach out shortly.</p>
            <a href="https://credex.rocks" style="color: #10b981;">Learn more →</a>
          </div>
          ` : ''}

          <p style="color: #64748b; font-size: 12px; margin-top: 32px;">
            You're receiving this because you ran a free audit on StackLens. 
            No spam — we only send audit reports.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Leads error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}