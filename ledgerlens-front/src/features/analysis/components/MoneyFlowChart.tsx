import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { MoneyFlowDataPoint } from "@/lib/analysis.types"

interface MoneyFlowChartProps {
  data: MoneyFlowDataPoint[]
  chain?: string
}

const plotData = (data: MoneyFlowDataPoint[]) =>
  data.filter((d) => d.label !== "Sin datos" || d.income_usd > 0 || d.expense_usd > 0)

export function MoneyFlowChart({ data }: MoneyFlowChartProps) {
  const chartData = plotData(data)
  const totalIncome = chartData.reduce((s, d) => s + (d.income_usd || 0), 0)
  const totalExpense = chartData.reduce((s, d) => s + (d.expense_usd || 0), 0)

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Ingresos y gastos en el tiempo
      </h3>
      <p className="mb-2 text-xs text-slate-600">
        Dinero recibido vs enviado (USD). Excluye transacciones marcadas como sospechosas.
      </p>
      <div className="mb-4 flex gap-4 text-xs">
        <span className="text-slate-500">
          Total ingresos: <strong className="text-emerald-400">+${totalIncome.toFixed(2)}</strong>
        </span>
        <span className="text-slate-500">
          Total gastos: <strong className="text-rose-400">−${totalExpense.toFixed(2)}</strong>
        </span>
      </div>
      <div className="relative h-[260px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/30 text-sm text-slate-500">
            No hay movimientos de dinero para mostrar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 5, bottom: 50 }}
            >
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="label"
                stroke="#475569"
                tick={{ fill: "#94a3b8", fontSize: 9, angle: -35, textAnchor: "end" }}
                interval={chartData.length > 8 ? Math.max(0, Math.floor(chartData.length / 5) - 1) : 0}
              />
              <YAxis
                stroke="#475569"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const row = payload[0]?.payload as { income_usd?: number; expense_usd?: number } | undefined
                  const income = Number(row?.income_usd ?? 0)
                  const expense = Number(row?.expense_usd ?? 0)
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
                      <p className="mb-2 font-medium text-slate-300">Fecha: {label}</p>
                      <p className="text-emerald-400">Ingresos: ${income.toFixed(2)} USD</p>
                      <p className="text-rose-400">Gastos: ${expense.toFixed(2)} USD</p>
                    </div>
                  )
                }}
              />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }} />
              <Bar dataKey="income_usd" name="Ingresos" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="expense_usd" name="Gastos" fill="#f43f5e" radius={[2, 2, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
