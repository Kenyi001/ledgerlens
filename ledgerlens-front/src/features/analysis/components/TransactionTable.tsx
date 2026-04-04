import { useMemo, useState } from "react"
import { 
  ExternalLink, 
  User, 
  Bot, 
  Route, 
  ShieldCheck, 
  ShieldOff,
  AlertTriangle, 
  Flame, 
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/lib/analysis.types"
import { getExplorerTxUrl } from "@/lib/explorer"

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
  const [hideScams, setHideScams] = useState(true)

  const filtered = useMemo(() => {
    let list = hideScams ? transactions.filter(t => !t.is_scam) : transactions

    switch (filter) {
      case "swaps": 
        return list.filter(t => t.action.toLowerCase().includes("swap") || t.action.toLowerCase().includes("route"))
      case "transfers": 
        return list.filter(t => t.action.toLowerCase().includes("transfer") || (t.token_amount && t.token_amount > 0) || (t.value_native && t.value_native > 0 && t.action.toLowerCase() !== "contract call"))
      case "risk": 
        return list.filter(t => t.risk_level === "danger" || t.risk_level === "warning" || t.is_scam)
      default: return list
    }
  }, [transactions, filter, hideScams])

  const scamCount = transactions.filter(t => t.is_scam).length

  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-0 overflow-hidden shadow-2xl">
      {/* Table Header HUD */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-4 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Ledger Feed: Live
          </h3>
          {scamCount > 0 && (
             <button 
               onClick={() => setHideScams(!hideScams)}
               className={cn(
                 "flex items-center gap-2 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border transition-all",
                 hideScams ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
               )}
             >
               {hideScams ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
               {hideScams ? `FILTERING_SCAM_NOISE (${scamCount})` : `SHOWING_ALL_TRAFFIC (UNSAFE)`}
             </button>
          )}
        </div>
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
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Counterparty</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Type</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 text-center">Threat</th>
              <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.slice(0, 500).map((t: any) => {
              const isApprove = t.action.toLowerCase().includes("approve")
              const isDanger = t.risk_level === "danger"
              const isWarning = t.risk_level === "warning"
              
              return (
                <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400">
                        {t.id.slice(0, 6)}...{t.id.slice(-4)}
                      </span>
                      {String(t.status) === "0" && (
                        <div title="Transaction Failed" className="text-rose-500">
                          <XCircle className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider",
                      String(t.status) === "0" ? "bg-rose-950/30 text-rose-500 border border-rose-500/20" : 
                      isApprove || isDanger ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : 
                      isWarning ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : 
                      "bg-white/5 text-slate-400 border border-white/5"
                    )}>
                      {t.flow === "in" && <ArrowDownLeft className="h-3 w-3" />}
                      {t.flow === "out" && <ArrowUpRight className="h-3 w-3" />}
                      {String(t.status) === "0" ? "FAILED" : t.action.split(" ").pop()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {t.token_amount && t.token_amount > 0 && (
                        <div className={cn(
                          "flex items-center gap-1.5 overflow-hidden",
                          t.flow === "in" ? "text-emerald-400" : "text-indigo-400"
                        )}>
                          <span className="font-mono text-[10px] font-bold truncate">
                            {t.flow === "in" ? "+" : "-"}{t.token_amount.toFixed(4)} {t.token_symbol}
                          </span>
                        </div>
                      )}
                      
                      {t.value_native && t.value_native > 0 ? (
                        <div className={cn(
                          "flex items-center gap-1.5 overflow-hidden",
                          t.flow === "in" ? "text-emerald-400" : "text-rose-400/90"
                        )}>
                          <Coins className="h-3 w-3 shrink-0" />
                          <span className="font-mono text-[10px] font-bold truncate">
                            {t.flow === "in" ? "+" : "-"}{t.value_native.toFixed(6)} {t.native_symbol || (chain === "ethereum" ? "ETH" : "AVAX")}
                          </span>
                        </div>
                      ) : !t.token_amount ? (
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                          0.0000 {t.native_symbol || (chain === "ethereum" ? "ETH" : "AVAX")}
                        </span>
                      ) : null}


                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        {t.flow_usd && t.flow_usd > 0 ? (
                          <span className="font-mono text-[9px] text-slate-400 opacity-80">${t.flow_usd.toFixed(2)} USD</span>
                        ) : null}
                        <span className="font-mono text-[8px] text-rose-500/80 font-bold tracking-tighter uppercase">
                          Gas: {t.gas_usd ? `$${t.gas_usd.toFixed(3)}` : "$0.00"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="font-mono text-[10px] text-slate-400">
                        {t.counterparty ? (t.counterparty.length > 20 ? `${t.counterparty.slice(0, 8)}...${t.counterparty.slice(-6)}` : t.counterparty) : "Unknown"}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-1.5">
                       {t.counterparty_type === "wallet" || t.counterparty_type === "user" ? (
                         <>
                           <User className="h-3 w-3 text-emerald-400" />
                           <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Usuario</span>
                         </>
                       ) : t.counterparty_type === "dex" || t.counterparty_type === "router" ? (
                         <>
                           <Route className="h-3 w-3 text-amber-400" />
                           <span className="text-[10px] font-bold text-amber-400 uppercase tracking-tighter">DEX/Router</span>
                         </>
                       ) : (
                         <>
                           <Bot className="h-3 w-3 text-indigo-400" />
                           <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{t.counterparty_type || "Contract"}</span>
                         </>
                       )}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {t.risk_level === "danger" ? (
                      <div className="flex justify-center" title="ALTO RIESGO: Patrón malicioso">
                        <Flame className="h-4 w-4 text-rose-500 animate-pulse" />
                      </div>
                    ) : t.risk_level === "warning" ? (
                      <div className="flex justify-center" title="ADVERTENCIA: Interacción sospechosa">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      </div>
                    ) : (
                      <div className="flex justify-center" title="Seguro">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/40" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-[10px] text-slate-500 italic">
                        {timeAgo(t.time)}
                      </span>
                      <a 
                        href={getExplorerTxUrl(chain, t.id) || "#"} 
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
              No direct sequence match
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
