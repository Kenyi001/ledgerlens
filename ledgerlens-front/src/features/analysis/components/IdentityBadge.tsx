import { Fingerprint } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnalysisResult } from "@/lib/analysis.types"

interface IdentityBadgeProps {
  result: AnalysisResult
}

export function IdentityBadge({ result }: IdentityBadgeProps) {
  const isBot = result.identity.toLowerCase().includes("bot")
  const riskColor =
    result.risk_score >= 70
      ? "text-rose-500"
      : result.risk_score >= 40
        ? "text-amber-500"
        : "text-emerald-500"

  const probability = (100 - result.risk_score).toFixed(2)

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-6 shadow-2xl transition-all hover:bg-white/[0.07] h-full min-h-[220px]">
      <div className="flex items-start justify-between">
        <div className="space-y-6 flex-1">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Identity Verification
            </span>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex items-center justify-center rounded border border-white/10 bg-black/40">
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
                <Fingerprint className="h-6 w-6 text-slate-400 opacity-50" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white line-clamp-2">
                STATUS: {isBot ? "SUSPICIOUS" : "VERIFIED HUMAN"}
              </h2>
            </div>
            {/* GenLayer Proof Tag */}
            <div className="flex items-center gap-2 pt-1">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                Syncing GenLayer Neural Proof...
              </span>
            </div>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-2">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">
              Probability<br />Index
            </span>
            <span className={cn("text-4xl font-black tracking-tighter tabular-nums", riskColor)}>
              {probability}%
            </span>
          </div>
          <div className="opacity-20 translate-x-4">
             <Fingerprint className="h-16 w-16 text-slate-500" strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Background Decorator */}
      <div className="absolute bottom-0 right-0 p-2 opacity-10 pointer-events-none font-mono text-[7px] uppercase tracking-widest text-slate-500">
        SECURE PROTOCOL V1.0 // GENLAYER NEURAL ENGINE
      </div>
    </div>
  )
}
