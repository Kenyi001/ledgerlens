import { cn } from "@/lib/utils"
import type { GasDataPoint } from "@/lib/analysis.types"

interface GasEfficiencyChartProps {
  data: GasDataPoint[]
  realTotalGas?: number
  txCount?: number
}

export function GasEfficiencyChart({ realTotalGas, txCount }: GasEfficiencyChartProps) {
  const avgGasUsd = txCount && txCount > 0 && realTotalGas !== undefined
    ? (realTotalGas / txCount).toFixed(4)
    : "0.0000"

  const totalGasStr = realTotalGas !== undefined ? `$${realTotalGas.toFixed(2)}` : "$0.00"

  // Calculamos el stroke-dasharray para el círculo
  const percentage = realTotalGas ? Math.min((realTotalGas / 5) * 100, 100) : 0
  const strokeDasharray = `${percentage} 100`

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-6 shadow-2xl transition-all hover:bg-white/[0.07] h-full min-h-[220px]">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex justify-between">
        Gas Intensity
        {realTotalGas !== undefined && <span className="text-[9px] text-white/40">Total: {totalGasStr}</span>}
      </span>

      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative h-32 w-32">
          {/* Circular Gauge SVG */}
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              className="text-white/5"
              strokeWidth="2.5"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              className="text-white transition-all duration-1000 ease-out"
              strokeWidth="2.5"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black tracking-tighter text-white">
              ${avgGasUsd}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-1">
              AVG FEE
            </span>
          </div>
        </div>
      </div>

      {/* Background Decorator */}
      <div className="absolute bottom-2 left-6 opacity-10 pointer-events-none">
         <div className="flex gap-1">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={cn("h-1 w-2 rounded-full bg-white", i < 4 ? "opacity-100" : "opacity-20")} />
            ))}
         </div>
      </div>
    </div>
  )
}
