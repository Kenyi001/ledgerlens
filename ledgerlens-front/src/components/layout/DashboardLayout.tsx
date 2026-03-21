import { Header } from "./Header"
import { useAnalysisStore } from "@/features/analysis/store/useAnalysisStore"
import { IdentityBadge } from "@/features/analysis/components/IdentityBadge"
import { GasEfficiencyChart } from "@/features/analysis/components/GasEfficiencyChart"
import { TransactionTable } from "@/features/analysis/components/TransactionTable"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Eye } from "lucide-react"

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 p-6">
        <div className="flex items-start gap-5">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-[320px] rounded-xl" />
      <Skeleton className="h-[280px] rounded-xl" />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 ring-1 ring-slate-800">
        <Eye className="h-10 w-10 text-indigo-400" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold text-slate-100">
          Financial Intelligence Dashboard
        </h2>
        <p className="text-sm leading-relaxed text-slate-400">
          Paste an Avalanche wallet address above to generate an AI-powered
          identity analysis. GenLayer will classify the wallet as Human or Bot
          and provide a risk assessment.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-4 py-2">
        <Search className="h-4 w-4 text-slate-600" />
        <span className="font-mono text-xs text-slate-600">
          0x71C7...4E28
        </span>
      </div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center">
      <p className="text-sm text-red-300">{message}</p>
    </div>
  )
}

export function DashboardLayout() {
  const { isLoading, analysisResult, walletAddress, error } = useAnalysisStore()

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {!isLoading && !analysisResult && !error && <EmptyState />}

        {error && !isLoading && <ErrorState message={error} />}

        {isLoading && (
          <div className="space-y-4">
            <p className="text-center text-sm text-slate-500">
              Analyzing{" "}
              <span className="font-mono text-indigo-400">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>{" "}
              with GenLayer AI...
            </p>
            <LoadingSkeleton />
          </div>
        )}

        {analysisResult && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Showing analysis for</span>
              <code className="rounded bg-slate-900 px-2 py-0.5 font-mono text-indigo-400">
                {walletAddress}
              </code>
            </div>

            <IdentityBadge result={analysisResult} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <GasEfficiencyChart data={analysisResult.gas_efficiency ?? []} />
              <TransactionTable transactions={analysisResult.transactions ?? []} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-600">
        LedgerLens — Aleph Hackathon 2026 · Powered by GenLayer &amp; Avalanche
      </footer>
    </div>
  )
}
