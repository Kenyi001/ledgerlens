import { useMemo, useState } from "react"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/lib/analysis.types"

interface TransactionTableProps {
  transactions: Transaction[]
  chain?: string
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function TransactionTable({ transactions, chain }: TransactionTableProps) {
  const [filter, setFilter] = useState<"all" | "swaps" | "transfers" | "risk">("all")

  const filtered = useMemo(() => {
    switch (filter) {
      case "swaps": return transactions.filter(t => t.action.toLowerCase().includes("swap"))
      case "transfers": return transactions.filter(t => t.action.toLowerCase().includes("transfer"))
      case "risk": return transactions.filter(t => t.is_scam || (t.flow === "out"))
      default: return transactions
    }
  }, [transactions, filter])

  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-0 overflow-hidden shadow-2xl">
      {/* Table Header HUD */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
          Ledger Feed: Live
        </h3>
        <div className="flex gap-2">
          {["SWAPS", "TRANSFERS", "HIGH RISK"].map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label.toLowerCase().replace(" ", "") as any)}
              className={cn(
                "px-3 py-1 rounded text-[9px] font-black tracking-widest transition-all border border-transparent uppercase",
                filter === label.toLowerCase().replace(" ", "") 
                  ? "bg-white/10 text-white border-white/10" 
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Tx Hash</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Method</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Value</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Source</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Destination</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.slice(0, 15).map((t) => {
              const isApprove = t.action.toLowerCase().includes("approve")
              
              return (
                <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400">
                        {t.id.slice(0, 6)}...{t.id.slice(-4)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-block px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider",
                      isApprove ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-white/5 text-slate-400 border border-white/5"
                    )}>
                      {t.action.split(" ").pop()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      {t.token_amount && t.token_amount > 0 ? (
                        <span className="font-mono text-[10px] font-bold text-indigo-400">
                          {t.token_amount.toFixed(4)} {t.token_symbol}
                        </span>
                      ) : t.value_native && t.value_native > 0 ? (
                        <span className="font-mono text-[10px] font-bold text-emerald-400">
                          {t.value_native.toFixed(4)} {t.native_symbol || (chain === "ethereum" ? "ETH" : "AVAX")}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                          0.0000 {t.native_symbol || (chain === "ethereum" ? "ETH" : "AVAX")}
                        </span>
                      )}
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        {t.flow_usd && t.flow_usd > 0 ? (
                          <span className="font-mono text-[9px] text-slate-400">${t.flow_usd.toFixed(2)} USD</span>
                        ) : null}
                        <span className="font-mono text-[8px] text-rose-500/80 font-semibold tracking-wide">
                          - GAS: {t.gas_usd ? `$${t.gas_usd.toFixed(3)}` : "$0.00"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="font-mono text-[10px] text-slate-500">
                        {t.counterparty.slice(0, 6)}...{t.counterparty.slice(-4)}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {t.counterparty_type || "Unknown Contract"}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 italic">
                          {timeAgo(t.time)}
                        </span>
                        <a 
                          href={`https://snowtrace.io/tx/${t.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <ExternalLink className="h-3 w-3 text-slate-600 hover:text-white" />
                        </a>
                     </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
              No sequence found for current filter
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
