// En Vercel: mismo origen. En local: backend en :3001
const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:3001" : "")

export async function fetchAnalysis(address: string) {
  const res = await fetch(`${API_BASE}/api/analyze/${encodeURIComponent(address)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message ?? err.error ?? "Error al analizar la billetera")
  }
  return res.json()
}
