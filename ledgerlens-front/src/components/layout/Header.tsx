import { useEffect, useRef, useState } from "react"
import { Search, Eye, Wallet, ChevronDown, LogOut, Sun, Moon } from "lucide-react"
import {
  useBalance,
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
} from "wagmi"
import { useAnalysisStore } from "@/features/analysis/store/useAnalysisStore"
import { useRunAnalysis } from "@/features/analysis/hooks/useRunAnalysis"
import { cn } from "@/lib/utils"

export function Header() {
  const [input, setInput] = useState("")
  const [walletMenuOpen, setWalletMenuOpen] = useState(false)
  const walletWrapRef = useRef<HTMLDivElement>(null)
  const { reset } = useAnalysisStore()
  const runAnalysis = useRunAnalysis()

  const { address, status } = useConnection()
  const connected = status === "connected" && !!address
  const { data: balance } = useBalance({ address: connected ? address : undefined })
  const connectors = useConnectors()
  const { mutate: connect, error: connectError, reset: resetConnect } = useConnect()
  const { mutateAsync: disconnectAsync } = useDisconnect()

  useEffect(() => {
    if (address) setInput(address)
  }, [address])

  useEffect(() => {
    if (!walletMenuOpen) return
    const onDoc = (ev: MouseEvent) => {
      if (
        walletWrapRef.current &&
        !walletWrapRef.current.contains(ev.target as Node)
      ) {
        setWalletMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [walletMenuOpen])

  const handleSearch = () => {
    const addr = input.trim()
    if (!addr) return
    void runAnalysis(addr)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`

  const changeWallet = async () => {
    try {
      await disconnectAsync()
    } finally {
      setWalletMenuOpen(true)
    }
  }

  const connectWithConnector = async (
    connector: (typeof connectors)[number]
  ) => {
    resetConnect?.()
    try {
      if (connected) await disconnectAsync()
    } catch {
      /* ignore */
    }
    connect({ connector })
    setWalletMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl px-6">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4">
        {/* Logo Left */}
        <button
          onClick={reset}
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 group-hover:bg-white/10 transition-colors">
            <Eye className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-black tracking-[0.4em] text-white uppercase font-prisma">
            PRISMA
          </span>
        </button>

        {/* Search Center */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 z-10" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="SEARCH WALLET ADDRESS..."
              className="w-full h-10 border border-white/5 bg-white/5 pl-10 pr-4 font-mono text-[11px] text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-white/20 rounded transition-all"
            />
          </div>
        </div>

        {/* Wallet Right */}
        <div className="relative" ref={walletWrapRef}>
          {connected ? (
            <button
              onClick={() => setWalletMenuOpen((o) => !o)}
              className="flex items-center gap-4 px-3 py-2 rounded border border-transparent hover:border-white/5 hover:bg-white/5 transition-all"
            >
              {balance && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                  {(Number(balance.value) / 10 ** balance.decimals).toFixed(4)} {balance.symbol}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white font-mono">
                  {shortAddress(address!)}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-500" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => setWalletMenuOpen((o) => !o)}
              className="h-9 px-4 flex items-center gap-2 rounded border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
            >
              <Wallet className="h-3.5 w-3.5" />
              Connect Wallet
            </button>
          )}

          {walletMenuOpen && (
            <div className="absolute right-0 top-full z-[100] mt-2 min-w-[220px] rounded border border-white/10 bg-slate-950 p-1 shadow-2xl shadow-black">
              {!connected ? (
                <>
                  {connectError && (
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-[10px] text-red-500 leading-tight">{connectError.message}</p>
                    </div>
                  )}
                  {connectors.length === 0 ? (
                    <p className="px-3 py-4 text-[10px] text-slate-500 uppercase tracking-widest">
                      No Wallets Found
                    </p>
                  ) : (
                    connectors.map((connector) => (
                      <button
                        key={connector.id}
                        type="button"
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded text-left text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => connectWithConnector(connector)}
                      >
                        {connector.name}
                      </button>
                    ))
                  )}
                </>
              ) : (
                <div className="py-1">
                  <button
                    onClick={() => changeWallet()}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded text-left text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Switch Wallet
                  </button>
                  <button
                    onClick={() => disconnectAsync()}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded text-left text-[10px] uppercase font-bold tracking-widest text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
