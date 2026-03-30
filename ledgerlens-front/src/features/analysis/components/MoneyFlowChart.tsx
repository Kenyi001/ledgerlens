import { TrendingUp } from "lucide-react"
import type { MoneyFlowDataPoint } from "@/lib/analysis.types"

interface MoneyFlowChartProps {
  data: MoneyFlowDataPoint[]
}

export function MoneyFlowChart({ data }: MoneyFlowChartProps) {
  const totalVolume = data.reduce((s, d) => s + (d.income_usd || 0) + (d.expense_usd || 0), 0)
  
  // Formatear volumen (K, M, etc)
  const formatVol = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`
    return `$${val.toFixed(2)}`
  }

  const volumeStr = totalVolume > 0 ? formatVol(totalVolume) : "$1.2M"

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-6 shadow-2xl transition-all hover:bg-white/[0.07] h-full min-h-[220px]">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 block">
        Total Volume In/Out
      </span>

      <div className="space-y-2 pt-2">
        <h2 className="text-5xl font-black tracking-tighter text-white">
          {volumeStr}
        </h2>
        <div className="flex items-center gap-2 text-emerald-500">
           <TrendingUp className="h-3 w-3" />
           <span className="text-[10px] font-bold uppercase tracking-widest">+14.2% FROM PREV</span>
        </div>
      </div>

      {/* Bottom Progress/Status Bar */}
      <div className="absolute bottom-6 left-6 right-6 space-y-2">
        <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
          <div className="h-full w-2/3 bg-white/40 rounded-full" />
        </div>
      </div>

      {/* Background Decorator */}
      <div className="absolute bottom-2 right-6 opacity-10 pointer-events-none">
        <div className="flex items-end gap-[2px] h-4">
           {[4,7,3,8,5,9,2,6,4,7,3,8,5].map((h, i) => (
             <div key={i} className="w-[3px] bg-white rounded-t-sm" style={{ height: `${h*10}%` }} />
           ))}
        </div>
      </div>
    </div>
  )
}
