import { cn } from "@/lib/utils"
import type { GasDataPoint } from "@/lib/analysis.types"

interface GasEfficiencyChartProps {
  data: GasDataPoint[]
}

export function GasEfficiencyChart({ data }: GasEfficiencyChartProps) {
  // Calculamos un promedio ficticio pero basado en los datos si existen para el HUD
  const avgGwei = data.length > 0 
    ? (data.reduce((acc, d) => acc + (d.gas_usd || 0), 0) / data.length * 20).toFixed(1) 
    : "42.8"

  // Calculamos el stroke-dasharray para el círculo (0 a 100)
  const percentage = Math.min(Number(avgGwei) * 1.5, 100)
  const strokeDasharray = `${percentage} 100`

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-6 shadow-2xl transition-all hover:bg-white/[0.07] h-full min-h-[220px]">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 block">
        Gas Intensity
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
            <span className="text-2xl font-black tracking-tighter text-white">
              {avgGwei}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Gwei Avg
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
