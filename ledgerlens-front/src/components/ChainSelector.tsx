import { useAnalysisStore } from "@/features/analysis/store/useAnalysisStore"
import { type SupportedChain } from "@/lib/api"
import { ChevronDown, Network } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const CHAINS: { id: SupportedChain; name: string; icon?: string }[] = [
  { id: "avalanche", name: "Avalanche" },
  { id: "ethereum", name: "Ethereum" },
  { id: "polygon", name: "Polygon" },
  { id: "bsc", name: "BSC" },
  { id: "fuji", name: "Fuji (Testnet)" },
]

export function ChainSelector() {
  const { chain, setChain } = useAnalysisStore()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen])

  const selectedChain = CHAINS.find((c) => c.id === chain) || CHAINS[0]

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
      >
        <Network className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white font-mono">
          {selectedChain.name}
        </span>
        <ChevronDown className="h-3 w-3 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 min-w-[160px] rounded border border-white/10 bg-slate-950 p-1 shadow-2xl z-[100]">
          {CHAINS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setChain(c.id)
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-3 px-3 py-2 rounded text-left text-[10px] uppercase font-bold tracking-widest transition-colors ${
                chain === c.id ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
