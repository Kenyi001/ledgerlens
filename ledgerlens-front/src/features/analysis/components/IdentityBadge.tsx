import { Bot, User, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnalysisResult } from "@/lib/mockData"

interface IdentityBadgeProps {
  result: AnalysisResult
}

export function IdentityBadge({ result }: IdentityBadgeProps) {
  const isBot = result.identity.toLowerCase().includes("bot")
  const riskColor =
    result.risk_score >= 70
      ? "text-red-400"
      : result.risk_score >= 40
        ? "text-yellow-400"
        : "text-emerald-400"

  return (
    <div
      className={cn(
        "relative rounded-xl border p-6 transition-all duration-500",
        isBot
          ? "border-red-500/60 bg-red-950/20 shadow-[0_0_25px_rgba(239,68,68,0.15)]"
          : "border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
      )}
    >
      <div className="flex items-start gap-5">
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-full",
            isBot
              ? "bg-red-500/20 text-red-400"
              : "bg-emerald-500/20 text-emerald-400"
          )}
        >
          {isBot ? <Bot className="h-8 w-8" /> : <User className="h-8 w-8" />}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100">
              {result.identity}
            </h2>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold",
                isBot
                  ? "bg-red-500/20 text-red-300"
                  : "bg-emerald-500/20 text-emerald-300"
              )}
            >
              {isBot ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <User className="h-3.5 w-3.5" />
              )}
              {isBot ? "Bot Detected" : "Human"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Risk Score</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  result.risk_score >= 70
                    ? "bg-gradient-to-r from-red-600 to-red-400"
                    : result.risk_score >= 40
                      ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-400"
                )}
                style={{ width: `${result.risk_score}%` }}
              />
            </div>
            <span className={cn("text-lg font-bold tabular-nums", riskColor)}>
              {result.risk_score}/100
            </span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-sm leading-relaxed text-slate-300">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                AI Narrative — GenLayer
              </span>
              {result.narrative}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
