import { Header } from "./Header"
import { useAnalysisStore } from "@/features/analysis/store/useAnalysisStore"
import { useRunAnalysis } from "@/features/analysis/hooks/useRunAnalysis"
import { IdentityBadge } from "@/features/analysis/components/IdentityBadge"
import { GasEfficiencyChart } from "@/features/analysis/components/GasEfficiencyChart"
import { MoneyFlowChart } from "@/features/analysis/components/MoneyFlowChart"
import { TransactionTable } from "@/features/analysis/components/TransactionTable"
import {
  Download,
  Search,
  Fingerprint,
  Eye,
  Wallet,
  AlertTriangle,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { useConnection } from "wagmi"
import { AiNarrativeTerminal } from "@/features/analysis/components/AiNarrativeTerminal"
import type { AnalysisResult } from "@/lib/analysis.types"
import { downloadReportPdf } from "@/lib/exportReport"

function ProtocolAlerts({ transactions }: { transactions: AnalysisResult["transactions"] }) {
  if (!transactions) return null;
  const alerts = [];
  
  const scams = transactions.filter(t => t.is_scam);
  if (scams.length > 0) {
    alerts.push({
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      title: 'High Risk Activity',
      desc: `${scams.length} Scam/High-Risk interac. detected`,
      bg: 'bg-red-500/10 border-red-500'
    });
  }
  
  const whales = transactions.filter(t => (t.flow_usd && t.flow_usd > 1000) || (t.value_usd && t.value_usd > 1000));
  whales.slice(0, 2).forEach(w => {
    alerts.push({
      icon: <Zap className="h-4 w-4 text-emerald-400" />,
      title: 'Whale Transfer',
      desc: `$${(w.flow_usd || w.value_usd || 0).toFixed(0)} moved to/from ${w.counterparty.slice(0, 6)}...`,
      bg: 'bg-emerald-500/10 border-emerald-500/50'
    });
  });

  const highGas = transactions.filter(t => t.gas_usd && t.gas_usd > 5);
  if (highGas.length > 0) {
    alerts.push({
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      title: 'Costly Gas Usage',
      desc: `${highGas.length} Tx with Gas > $5 detected`,
      bg: 'bg-amber-500/10 border-amber-500'
    });
  }

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/5 p-6 h-full min-h-[220px]">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 block">
          Protocol Alerts
        </span>
        <div className="flex flex-col items-center justify-center h-24 gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
               NO ANOMALIES DETECTED
            </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-6 h-full min-h-[220px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Protocol Alerts
        </span>
        <span className="text-[9px] font-mono text-white/40">{alerts.length} found</span>
      </div>
      <div className="space-y-3">
        {alerts.slice(0, 3).map((a, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded border-l-2 ${a.bg}`}>
            {a.icon}
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black uppercase text-white truncate">{a.title}</p>
              <p className="text-[9px] text-slate-400 font-mono truncate">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-pulse" id="loading-skeleton">
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="flex items-center gap-3 px-4 py-1 border border-red-500/20 bg-red-500/5">
          <AlertTriangle className="h-3 w-3 text-red-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">
            RESTRICTED_ACCESS: DECRYPTING_NEURAL_LOGS
          </span>
        </div>
      </div>

      <div className="w-full max-w-2xl rounded-xl border border-white/5 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              STATUS: ESTABLISHING_SECURE_LINK...
            </span>
            <span className="text-[10px] font-mono text-emerald-500">72.4% COMPLETE</span>
          </div>
          
          <div className="h-1.5 w-full bg-white/5 overflow-hidden">
            <div className="h-full bg-white/40 animate-[loading-bar_2s_infinite]" />
          </div>

          <div className="space-y-2 font-mono text-[10px] text-slate-400">
            <div className="flex gap-4">
              <span className="text-slate-600">[0.001s]</span>
              <span>&gt; CONNECTING_TO_GLACIER_NODE... OK</span>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-600">[0.045s]</span>
              <span>&gt; PARSING_BLOCKCHAIN_SEQUENCES... OK</span>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-600">[0.122s]</span>
              <span>&gt; ANALYZING_IDENTITY_PATTERNS... IN_PROGRESS</span>
            </div>
            <div className="flex gap-4 opacity-50">
              <span className="text-slate-600">[0.211s]</span>
              <span>&gt; GENERATING_AI_NARRATIVE... PENDING</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">
        L37-PRISMA-SECURE-ENCLAVE — DO NOT INTERRUPT
      </div>
    </div>
  )
}

function EmptyState({
  onAnalyzeMyWallet,
  hasConnectedWallet,
}: {
  onAnalyzeMyWallet?: () => void
  hasConnectedWallet?: boolean
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const lensRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!lensRef.current) return
      const rect = lensRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) / 25
      const deltaY = (e.clientY - centerY) / 25
      const limit = 6
      setMousePos({ 
        x: Math.max(-limit, Math.min(limit, deltaX)), 
        y: Math.max(-limit, Math.min(limit, deltaY)) 
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center gap-10 text-center relative z-10" id="empty-state">
      <div className="relative mb-8 group" ref={lensRef}>
        <div className="absolute inset-0 -m-8 rounded-full border border-border/10 animate-spin-slow-very pointer-events-none" />
        <div className="absolute inset-0 -m-8 border-t border-border rounded-full animate-spin-slow-very pointer-events-none" />
        <div className="relative h-20 w-20 flex items-center justify-center rounded-full bg-slate-900 ring-1 ring-white/10 shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none opacity-30" />
          <div style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)`, transition: 'transform 0.1s ease-out' }}>
            <Eye className="h-10 w-10 text-white animate-blink opacity-80" />
          </div>
          <div className="absolute inset-0 scanline-overlay opacity-20" />
        </div>
        <div className="absolute -top-4 -left-4 w-4 h-4 border-t border-l border-white/20" />
        <div className="absolute -top-4 -right-4 w-4 h-4 border-t border-r border-white/20" />
        <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b border-l border-white/20" />
        <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b border-r border-white/20" />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-300 font-bold">
              Biometric Access Terminal
            </span>
          </div>
          <h1 className="text-7xl sm:text-9xl font-black text-white tracking-prisma relative py-2">
            PRISMA
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-white rounded-full opacity-60" />
          </h1>
        </div>
        <p className="max-w-2xl text-[11px] sm:text-xs leading-[1.6] tracking-[0.15em] text-slate-500 font-bold uppercase mx-auto px-4">
          AI-Driven Intelligence Engine. Detect Bots, Assess Risk,<br />
          and Track Capital Flows Across EVM Networks.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
        {hasConnectedWallet && onAnalyzeMyWallet && (
          <button
            type="button"
            onClick={onAnalyzeMyWallet}
            className="group h-14 inline-flex items-center gap-3 rounded bg-white px-8 text-xs font-black tracking-widest text-slate-950 transition-all hover:bg-slate-200 active:scale-95 shadow-xl shadow-white/5"
          >
            <Wallet className="h-4 w-4" />
            SCAN CONNECTED WALLET
          </button>
        )}
        <button className="h-14 inline-flex items-center gap-3 rounded border border-white/5 bg-white/5 px-8 text-xs font-black tracking-widest text-slate-600 transition-all hover:bg-white/10">
          <Search className="h-4 w-4" />
          PASTE ADDRESS ABOVE TO BEGIN
        </button>
      </div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center" id="error-state">
      <p className="text-sm text-red-300">{message}</p>
    </div>
  )
}

function WalletStatsSummary({ result }: { result: AnalysisResult }) {
  if (!result || !result.wallet_summary) return null
  const { current_balance_native, total_received_usd, total_sent_usd, total_gas_spent_usd } = result.wallet_summary
  const symbol = result.chain?.toLowerCase() === "ethereum" ? "ETH" : "AVAX"
  const volumeUsd = (total_received_usd || 0) + (total_sent_usd || 0)
  const netFlowUsd = (total_received_usd || 0) - (total_sent_usd || 0)

  return (
    <div className="space-y-3" id="wallet-stats">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Current Balance</span>
          <span className="text-xl text-white font-black">
            {current_balance_native.toFixed(4)} {symbol}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-white/5 sm:pl-4 pt-3 sm:pt-0">
          <span className="text-[10px] text-emerald-500/80 uppercase tracking-wider font-bold">Total Inflow (USD)</span>
          <span className="text-xl text-emerald-400 font-black">
            ${total_received_usd.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-white/5 sm:pl-4 pt-3 sm:pt-0">
          <span className="text-[10px] text-rose-500/80 uppercase tracking-wider font-bold">Total Outflow (USD)</span>
          <span className="text-xl text-rose-400 font-black">
            ${total_sent_usd.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-white/5 sm:pl-4 pt-3 sm:pt-0">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Gas Spent (USD)</span>
          <span className="text-xl text-white font-black">
            ${(total_gas_spent_usd || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-white/5 sm:pl-4 pt-3 sm:pt-0">
          <span className="text-[10px] text-indigo-400/80 uppercase tracking-wider font-bold">Net Capital Flow</span>
          <span className={cn("text-xl font-black", netFlowUsd >= 0 ? "text-emerald-400" : "text-rose-400")}>
            {netFlowUsd >= 0 ? "+" : ""}${netFlowUsd.toFixed(2)}
          </span>
        </div>
      </div>
      <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
        ESTIMATED VOLUME (LEGITIMATE TRANSFERS): ${volumeUsd.toFixed(2)} USD. SCAM ATTEMPTS EXCLUDED FROM CALCULATION.
      </p>
    </div>
  )
}

export function DashboardLayout() {
  const { isLoading, analysisResult, walletAddress, error } = useAnalysisStore()
  const runAnalysis = useRunAnalysis()
  const { address } = useConnection()

  const isMyWallet = !!address && !!walletAddress && address.toLowerCase() === walletAddress.toLowerCase()

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-200 relative overflow-hidden" id="dashboard-layout">
      {/* Global Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 scanline-overlay opacity-[0.03]" />
      
      {/* Biometric Background Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Fingerprint className="absolute -bottom-24 -right-24 h-[600px] w-[600px] text-indigo-500/10 animate-pulse-slow" strokeWidth={0.5} />
        <Fingerprint className="absolute -top-32 -left-32 h-[400px] w-[400px] text-indigo-400/5 animate-spin-slow-very" strokeWidth={0.5} />
      </div>

      <Header />

      <main className="flex-1 px-4 py-8 sm:px-6 relative z-10 w-full max-w-[1600px] mx-auto transition-all">
        {/* Terminal Corner Marks (HUD) */}
        <div className="absolute top-4 left-4 h-8 w-8 border-t border-l border-white/20 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 h-8 w-8 border-t border-r border-white/20 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 h-8 w-8 border-b border-l border-white/20 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 h-8 w-8 border-b border-r border-white/20 rounded-br-lg pointer-events-none" />

        {!isLoading && !analysisResult && !error && (
          <EmptyState hasConnectedWallet={!!address} onAnalyzeMyWallet={address ? () => void runAnalysis(address) : undefined} />
        )}

        {error && !isLoading && <ErrorState message={error} />}

        {isLoading && (
          <div className="space-y-4">
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
              ANALYZING <span className="font-mono text-indigo-400">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span> VIA NEURAL LINK...
            </p>
            <LoadingSkeleton />
          </div>
        )}

        {analysisResult && !isLoading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <WalletStatsSummary result={analysisResult} />
            
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2">
                <span>TARGET:</span>
                <code className="rounded bg-white/5 border border-white/5 px-2 py-0.5 font-mono text-indigo-400">
                  {walletAddress}
                </code>
              </div>
              
              {isMyWallet && (
                <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-emerald-400">
                  OWNER_VERIFIED
                </span>
              )}

              {analysisResult.chain && (
                <span className="rounded bg-white/5 border border-white/5 px-2 py-0.5">
                  CHAIN: {analysisResult.chain}
                </span>
              )}

              <button
                type="button"
                onClick={() => downloadReportPdf(analysisResult, walletAddress)}
                className="inline-flex items-center gap-2 rounded bg-white/5 border border-white/10 px-3 py-1 hover:bg-white/10 text-white transition-colors"
              >
                <Download className="h-3 w-3" />
                EXPORT_PDF
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <IdentityBadge result={analysisResult} address={address || ""} />
              </div>
              <div className="md:col-span-2">
                <AiNarrativeTerminal result={analysisResult} address={walletAddress} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <GasEfficiencyChart 
                data={analysisResult.gas_efficiency ?? []} 
                realTotalGas={analysisResult.wallet_summary?.total_gas_spent_usd}
                txCount={analysisResult.transactions?.length}
              />
              <MoneyFlowChart 
                data={analysisResult.money_flow ?? []} 
                realVolume={(analysisResult.wallet_summary?.total_received_usd || 0) + (analysisResult.wallet_summary?.total_sent_usd || 0)}
              />
              
              {/* Protocol Alerts HUD */}
              <ProtocolAlerts transactions={analysisResult.transactions} />
            </div>

            <TransactionTable
              chain={analysisResult.chain}
              transactions={analysisResult.transactions ?? []}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-6 px-6 relative z-10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 font-mono">
            PRISMA_CORE // © 2026
          </span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">
                SYSTEM_LIVE
              </span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-700">
              VER_1.0.42_STABLE
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
