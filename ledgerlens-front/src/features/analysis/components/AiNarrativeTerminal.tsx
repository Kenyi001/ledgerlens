import { Brain } from "lucide-react"
import type { AnalysisResult } from "@/lib/analysis.types"

interface AiNarrativeTerminalProps {
  result: AnalysisResult
  address?: string
}

export function AiNarrativeTerminal({ result, address }: AiNarrativeTerminalProps) {
  // Dividir la narrativa en líneas para simular una terminal
  const narrativeLines = result.narrative ? result.narrative.split(". ").filter(l => l.trim().length > 0) : []
  
  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "0x..."

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-black/40 backdrop-blur-sm p-0 shadow-2xl h-full min-h-[220px]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
            AI Narrative Terminal
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-[11px] leading-relaxed text-slate-400">
        <div className="space-y-1">
          <p className="flex gap-2">
            <span className="text-indigo-500/50 shrink-0">&gt;</span>
            <span className="text-slate-500 uppercase">ANALYZING WALLET {shortAddr}</span>
          </p>
          
          {narrativeLines.map((line, i) => (
            <p key={i} className="flex gap-2 group">
              <span className="text-indigo-500/50 shrink-0 select-none group-hover:text-indigo-400 transition-colors">&gt;</span>
              <span className="transition-colors group-hover:text-slate-300">
                {line.endsWith('.') ? line : `${line}.`}
              </span>
            </p>
          ))}
          
          <p className="flex gap-2 animate-pulse pt-2 text-[10px]">
             <span className="text-indigo-500/50 shrink-0">&gt;</span>
             <span className="text-indigo-400/80 font-bold uppercase tracking-widest">
                Risk_Score: {result.risk_score}.0 (
                {result.risk_score > 70 ? "HIGH_ALERT" : result.risk_score > 40 ? "MODERATE" : "LOW_NEUTRAL"}
                )
             </span>
          </p>
        </div>
      </div>

      {/* Subtle Scanline Effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent bg-[length:100%_4px] opacity-20" />
      
      {/* Identifier Decorator */}
      <div className="absolute bottom-2 right-4 opacity-10 pointer-events-none flex items-center gap-2">
        <div className="h-[1px] w-8 bg-slate-500" />
        <span className="text-[7px] uppercase tracking-[0.3em] font-bold text-slate-500">
          Neural_Log_Sequence
        </span>
      </div>
    </div>
  )
}
