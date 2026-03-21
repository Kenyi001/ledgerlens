import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowRightLeft, Send, ShieldCheck, Waypoints } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/lib/mockData"

const columnHelper = createColumnHelper<Transaction>()

const actionIcons: Record<string, React.ReactNode> = {
  Swap: <ArrowRightLeft className="h-4 w-4 text-blue-400" />,
  Transfer: <Send className="h-4 w-4 text-emerald-400" />,
  Approve: <ShieldCheck className="h-4 w-4 text-yellow-400" />,
  Bridge: <Waypoints className="h-4 w-4 text-purple-400" />,
}

const columns = [
  columnHelper.accessor("time", {
    header: "Time",
    cell: (info) => (
      <span className="font-mono text-xs text-slate-400">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("action", {
    header: "Action",
    cell: (info) => (
      <span className="inline-flex items-center gap-2">
        {actionIcons[info.getValue()]}
        <span className="text-sm font-medium text-slate-200">
          {info.getValue()}
        </span>
      </span>
    ),
  }),
  columnHelper.accessor("counterparty", {
    header: "Counterparty",
    cell: (info) => (
      <span className="font-mono text-xs text-slate-400">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("gas_usd", {
    header: "Gas (USD)",
    cell: (info) => {
      const val = info.getValue()
      return (
        <span
          className={cn(
            "font-mono text-sm font-semibold",
            val > 5 ? "text-red-400" : "text-slate-300"
          )}
        >
          ${val.toFixed(2)}
        </span>
      )
    },
  }),
]

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Recent Transactions
      </h3>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="border-slate-800 bg-slate-900/80 hover:bg-slate-900/80"
              >
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-slate-800 transition-colors hover:bg-slate-900/60"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
