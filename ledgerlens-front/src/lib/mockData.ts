export interface Transaction {
  id: string
  time: string
  action: "Swap" | "Transfer" | "Approve" | "Bridge"
  counterparty: string
  gas_usd: number
}

export interface AnalysisResult {
  identity: string
  risk_score: number
  narrative: string
  transactions: Transaction[]
  gas_efficiency: GasDataPoint[]
}

export interface GasDataPoint {
  hour: string
  gas_usd: number
  avg_network: number
}

export const mockAnalysis: AnalysisResult = {
  identity: "High-Frequency Trading Bot",
  risk_score: 85,
  narrative:
    "Esta cuenta opera 24/7 interactuando principalmente con routers DEX como Trader Joe y Pangolin. Se detectó alto consumo de gas en ataques MEV (sandwich attacks). El patrón de transacciones muestra intervalos sub-segundo consistentes con ejecución algorítmica. GenLayer clasifica esta billetera como un Bot de Alta Frecuencia con nivel de confianza del 94%.",
  transactions: [
    {
      id: "0xabc1",
      time: "2026-03-20 14:32:01",
      action: "Swap",
      counterparty: "0x60aE...b2F4 (TraderJoe Router)",
      gas_usd: 4.82,
    },
    {
      id: "0xabc2",
      time: "2026-03-20 14:32:03",
      action: "Swap",
      counterparty: "0x60aE...b2F4 (TraderJoe Router)",
      gas_usd: 12.35,
    },
    {
      id: "0xabc3",
      time: "2026-03-20 14:31:58",
      action: "Transfer",
      counterparty: "0x7a25...9cD1 (Unknown)",
      gas_usd: 0.45,
    },
    {
      id: "0xabc4",
      time: "2026-03-20 14:30:15",
      action: "Approve",
      counterparty: "0xB31f...e8A3 (Pangolin DEX)",
      gas_usd: 0.21,
    },
    {
      id: "0xabc5",
      time: "2026-03-20 14:29:44",
      action: "Swap",
      counterparty: "0xB31f...e8A3 (Pangolin DEX)",
      gas_usd: 8.67,
    },
  ],
  gas_efficiency: [
    { hour: "00:00", gas_usd: 3.2, avg_network: 1.1 },
    { hour: "04:00", gas_usd: 5.8, avg_network: 0.9 },
    { hour: "08:00", gas_usd: 12.4, avg_network: 2.3 },
    { hour: "12:00", gas_usd: 8.1, avg_network: 3.1 },
    { hour: "16:00", gas_usd: 15.6, avg_network: 2.8 },
    { hour: "20:00", gas_usd: 9.3, avg_network: 1.5 },
  ],
}
