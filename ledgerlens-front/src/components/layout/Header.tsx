import { useState } from "react"
import { Search, Loader2, Eye, Wallet } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAnalysisStore } from "@/features/analysis/store/useAnalysisStore"

export function Header() {
  const [input, setInput] = useState("")
  const { isLoading, fetchAnalysis, reset } = useAnalysisStore()

  const handleSearch = () => {
    const address = input.trim()
    if (!address) return
    fetchAnalysis(address)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <button
          onClick={reset}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Eye className="h-6 w-6 text-indigo-400" />
          <span className="text-lg font-bold tracking-tight text-slate-100">
            Ledger<span className="text-indigo-400">Lens</span>
          </span>
        </button>

        <div className="relative flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste an Avalanche wallet address (0x...)"
              className="h-10 border-slate-800 bg-slate-900/50 pl-10 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus-visible:ring-indigo-500/40"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !input.trim()}
            className="h-10 shrink-0 bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          className="hidden h-10 shrink-0 gap-2 border-slate-700 bg-transparent text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100 sm:inline-flex"
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    </header>
  )
}
