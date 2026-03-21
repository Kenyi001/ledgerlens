import type { AnalysisResult } from "./analysis.types"

// En Vercel: mismo origen. En local: backend en :3001 (ver .env.example)
const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:3001" : "")

export type SupportedChain = "avalanche" | "ethereum"

export async function fetchAnalysis(
  address: string,
  chain: SupportedChain
): Promise<AnalysisResult> {
  const query = new URLSearchParams({ chain })
  const res = await fetch(
    `${API_BASE}/api/analyze/${encodeURIComponent(address)}?${query.toString()}`
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message ?? err.error ?? "Error al analizar la billetera")
  }
  return res.json() as Promise<AnalysisResult>
}
