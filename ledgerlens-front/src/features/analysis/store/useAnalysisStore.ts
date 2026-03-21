import { create } from "zustand"
import { fetchAnalysis as fetchAnalysisApi } from "@/lib/api"
import type { AnalysisResult } from "@/lib/mockData"

interface AnalysisState {
  walletAddress: string
  isLoading: boolean
  analysisResult: AnalysisResult | null
  error: string | null
  setWalletAddress: (address: string) => void
  fetchAnalysis: (address: string) => void
  reset: () => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  walletAddress: "",
  isLoading: false,
  analysisResult: null,
  error: null,

  setWalletAddress: (address) => set({ walletAddress: address }),

  fetchAnalysis: async (address) => {
    const trimmed = address.trim()
    if (!trimmed) return

    set({ isLoading: true, walletAddress: trimmed, analysisResult: null, error: null })

    try {
      const result = await fetchAnalysisApi(trimmed)
      set({ isLoading: false, analysisResult: result })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      })
    }
  },

  reset: () =>
    set({ walletAddress: "", isLoading: false, analysisResult: null, error: null }),
}))
