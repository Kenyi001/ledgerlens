/**
 * Formato de respuesta de GET /api/analyze/:address (backend LedgerLens).
 * No incluye datos de prueba: solo tipos compartidos por el dashboard.
 */
export interface Transaction {
  id: string
  time: string
  action: "Swap" | "Transfer" | "Approve" | "Bridge"
  counterparty: string
  gas_usd: number
}

export interface GasDataPoint {
  hour: string
  gas_usd: number
  avg_network: number
}

export interface AnalysisResult {
  identity: string
  risk_score: number
  narrative: string
  transactions: Transaction[]
  gas_efficiency: GasDataPoint[]
  /** Red usada para el análisis (viene del backend) */
  chain?: string
}
