'use client'

import { useState } from 'react'
import { Share2, Check, Copy } from 'lucide-react'

interface ShareButtonProps {
  auditId: string
  monthlySavings: number
}

export default function ShareButton({ auditId, monthlySavings }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}`
  const shareText = monthlySavings > 0
    ? `I just found $${monthlySavings.toLocaleString()}/mo in potential AI tool savings with StackLens 🔍`
    : `I just audited my AI tool spend with StackLens — turns out I'm spending well ✅`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My StackLens AI Spend Audit', text: shareText, url: shareUrl })
      } catch {
        // user dismissed
      }
    }
  }

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg border border-slate-700 transition-colors"
        aria-label="Copy share link"
      >
        {copied
          ? <><Check className="w-4 h-4 text-emerald-400" /> Copied!</>
          : <><Copy className="w-4 h-4" /> Copy link</>
        }
      </button>

      <button
        onClick={handleTwitter}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg border border-slate-700 transition-colors"
        aria-label="Share on X / Twitter"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>

      {hasNativeShare && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg border border-slate-700 transition-colors"
          aria-label="Share via device"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      )}
    </div>
  )
}