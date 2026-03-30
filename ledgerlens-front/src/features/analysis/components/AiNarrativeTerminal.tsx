<<<<<<< HEAD
import { useEffect, useRef, useState } from "react"
import { Terminal, Cpu, Database } from "lucide-react"
import type { AnalysisResult } from "@/lib/analysis.types"
import { DecryptText } from "@/components/ui/DecryptText"

interface AiNarrativeTerminalProps {
  result: AnalysisResult
  address: string
}

export function AiNarrativeTerminal({ result, address }: AiNarrativeTerminalProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [index, setIndex] = useState(0)
  const fullText = result.narrative || "No neural data logs available for this sequence."
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index])
        setIndex((i) => i + 1)
      }, 15)
      return () => clearTimeout(timeout)
    }
  }, [index, fullText])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [displayedText])

  return (
    <div className="flex h-full min-h-[400px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl backdrop-blur-xl transition-all hover:border-accent/20">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Terminal className="h-4 w-4 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Neural Log Sequence: PRISMA_V1
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-3 w-3 text-slate-500" />
            <span className="text-[9px] font-bold text-slate-500 uppercase">Procesando...</span>
          </div>
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-rose-500/30" />
            <div className="h-2 w-2 rounded-full bg-amber-500/30" />
            <div className="h-2 w-2 rounded-full bg-emerald-500/30" />
          </div>
=======
import { Brain } from "lucide-react"
import type { AnalysisResult } from "@/lib/analysis.types"

interface AiNarrativeTerminalProps {
  result: AnalysisResult
  address?: string
}

export function AiNarrativeTerminal({ result, address }: AiNarrativeTerminalProps) {
  // Dividir la narrativa en líneas para simular una terminal
  const narrativeLines = result.narrative.split(". ").filter(l => l.trim().length > 0)
  
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
>>>>>>> origin/cambios-victor
        </div>
      </div>

      {/* Terminal Content */}
<<<<<<< HEAD
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed text-slate-400 selection:bg-emerald-500/30 selection:text-emerald-200"
      >
        <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-2">
          <Database className="h-3 w-3 text-indigo-400" />
          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
            Source: {address.slice(0, 8)}...{address.slice(-6)}
          </span>
          <span className="ml-auto text-[9px] text-slate-600 font-bold uppercase">
            STATUS: ACTIVE
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="shrink-0 text-accent font-black tracking-tighter">&gt;</span>
            <div className="whitespace-pre-wrap">
              <DecryptText text={displayedText} speed={10} />
            </div>
          </div>
          {index < fullText.length && (
            <span className="inline-block h-3 w-1.5 animate-pulse bg-emerald-500/50" />
          )}
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="border-t border-border bg-muted/20 px-4 py-2 flex items-center justify-between">
         <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter animate-pulse">
            Listening for network signals...
         </span>
         <span className="text-[9px] font-mono text-slate-700">
            LLM-70B-INSTR-V1
         </span>
=======
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
>>>>>>> origin/cambios-victor
      </div>
    </div>
  )
}
