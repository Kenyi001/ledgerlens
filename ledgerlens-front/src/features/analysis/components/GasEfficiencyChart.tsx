import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { GasDataPoint } from "@/lib/analysis.types"

interface GasEfficiencyChartProps {
  data: GasDataPoint[]
  chain?: string
}

const chartData = (data: GasDataPoint[]) =>
  data.map((d) => ({
    ...d,
    xKey: d.label || d.hour || "-",
  }))

const NATIVE_SYMBOL: Record<string, string> = {
  avalanche: "AVAX",
  fuji: "AVAX",
  ethereum: "ETH",
}

export function GasEfficiencyChart({ data, chain = "avalanche" }: GasEfficiencyChartProps) {
  const plotData = chartData(data).filter((d) => d.label !== "Sin datos" || d.gas_usd > 0)
  const totalGas = plotData.reduce((s, d) => s + (d.gas_usd || 0), 0)
  const totalTxs = plotData.reduce((s, d) => s + (d.tx_count ?? 1), 0)
  const symbol = NATIVE_SYMBOL[chain] ?? "AVAX/ETH"

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Gastos en gas — evolución en el tiempo
      </h3>
      <p className="mb-2 text-xs text-slate-600">
        Gas (USD) por transacción ordenada cronológicamente. Cálculo: gas usado ×
        precio nativo ({symbol}). Solo tus txs, sin estimados.
      </p>
      <div className="mb-4 flex gap-4 text-xs">
        <span className="text-slate-500">
          Total gas: <strong className="text-slate-300">${totalGas.toFixed(2)}</strong>
        </span>
        <span className="text-slate-500">
          Transacciones: <strong className="text-slate-300">{totalTxs}</strong>
        </span>
      </div>
      <div className="relative h-[260px] w-full">
        {plotData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
            No hay transacciones con gas para mostrar
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={plotData}
            margin={{ top: 10, right: 10, left: 5, bottom: 50 }}
          >
            <defs>
              <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis
              dataKey="xKey"
              stroke="var(--foreground)"
              tick={{ fill: "var(--secondary)", fontSize: 9, angle: -35, textAnchor: "end" }}
              interval={plotData.length > 8 ? Math.max(0, Math.floor(plotData.length / 5) - 1) : 0}
            />
            <YAxis
              stroke="var(--foreground)"
              tick={{ fill: "var(--secondary)", fontSize: 12 }}
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
              }}
              formatter={(value, _name, props) => {
                const p = props?.payload
                const txs = p?.tx_count != null ? ` · ${p.tx_count} txs` : ""
                const act = p?.action ? ` · ${p.action}` : ""
                return [`$${Number(value).toFixed(2)}${txs}${act}`, "Gas (USD)"]
              }}
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }} />
            <Area
              type="monotone"
              dataKey="gas_usd"
              name="Gas (USD)"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#gasGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
