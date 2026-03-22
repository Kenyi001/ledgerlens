import { jsPDF } from "jspdf"
import { autoTable } from "jspdf-autotable"
import type { AnalysisResult } from "./analysis.types"
import { normalizeToLatin } from "./utils"

/** Sanitiza texto para evitar caracteres que jsPDF puede renderizar mal */
function safeText(s: unknown): string {
  if (s == null || s === undefined) return "-"
  const str = String(s).trim()
  return str.length > 0 ? normalizeToLatin(str) : "-"
}

export function downloadReportPdf(result: AnalysisResult, walletAddress: string) {
  const doc = new jsPDF({ format: "a4", unit: "mm" })
  const margin = 15
  let y = 20

  const addText = (text: string, size = 10, bold = false) => {
    doc.setFontSize(size)
    doc.setFont("helvetica", bold ? "bold" : "normal")
    const lines = doc.splitTextToSize(safeText(text), 180)
    for (const line of lines) {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      doc.text(line, margin, y)
      y += size * 0.4
    }
    y += 3
  }

  doc.setFillColor(99, 102, 241)
  doc.rect(0, 0, 210, 25, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.text("Prisma — Reporte de Análisis", margin, 18)
  doc.setTextColor(0, 0, 0)
  y = 35

  addText(`Dirección: ${walletAddress}`, 10, true)
  addText(`Red: ${result.chain ?? "N/A"}`, 9)
  addText(`Fecha del reporte: ${new Date().toLocaleDateString("es", { dateStyle: "long" })}`, 9)
  y += 5

  addText("Clasificación", 12, true)
  autoTable(doc, {
    startY: y,
    head: [["Campo", "Valor"]],
    body: [
      ["Identidad", safeText(result.identity)],
      ["Riesgo", `${result.risk_score}/100`],
      ["Narrativa", safeText(result.narrative)],
    ],
    margin: { left: margin },
    theme: "plain",
    styles: { fontSize: 9 },
    headStyles: { fillColor: [51, 65, 85], textColor: 255 },
    columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 135 } },
  })
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8

  if (result.wallet_summary) {
    const ws = result.wallet_summary
    const sym = result.chain === "ethereum" ? "ETH" : "AVAX"
    const volUsd = (ws.total_received_usd ?? 0) + (ws.total_sent_usd ?? 0)
    const netFlowUsd = (ws.total_received_usd ?? 0) - (ws.total_sent_usd ?? 0)
    addText("Resumen de fondos", 12, true)
    autoTable(doc, {
      startY: y,
      head: [["Concepto", "Valor"]],
      body: [
        ["Balance actual", `${(ws.current_balance_native ?? 0).toFixed(4)} ${sym}`],
        ["Recibido (USD)", `$${(ws.total_received_usd ?? 0).toFixed(2)}`],
        ["Enviado (USD)", `$${(ws.total_sent_usd ?? 0).toFixed(2)}`],
        ["Fondos estimados (flujo neto USD)", `${netFlowUsd >= 0 ? "+$" : "-$"}${Math.abs(netFlowUsd).toFixed(2)}`],
        ["Volumen total (recibido + enviado)", `$${volUsd.toFixed(2)} USD`],
        ["Gas gastado", `$${(ws.total_gas_spent_usd ?? 0).toFixed(2)}`],
      ],
      margin: { left: margin },
      theme: "plain",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [51, 65, 85], textColor: 255 },
      columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 110 } },
    })
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
  }

  if (result.interaction_breakdown && result.interaction_breakdown.length > 0) {
    addText("Tipos de cuenta con los que interactuaste", 12, true)
    autoTable(doc, {
      startY: y,
      head: [["Tipo", "Cantidad"]],
      body: result.interaction_breakdown.map((b) => [safeText(b.label), String(b.count)]),
      margin: { left: margin },
      theme: "plain",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [51, 65, 85], textColor: 255 },
      columnStyles: { 0: { cellWidth: 130 }, 1: { cellWidth: 50 } },
    })
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
  }

  addText("Transacciones recientes", 12, true)
  const txs = (result.transactions ?? []).slice(0, 30)
  const txRows = txs.map((t) => {
    const date = safeText(t.time?.slice(0, 10))
    const action = safeText(t.action)
    const tag = t.is_scam ? "SOSPECHOSO" : safeText(t.counterparty_type)
    const gas = `$${(t.gas_usd ?? 0).toFixed(2)}`
    const vol = t.value_usd != null ? `$${t.value_usd.toFixed(2)}` : "-"
    return [date, action, tag, vol, gas]
  })

  autoTable(doc, {
    startY: y,
    head: [["Fecha", "Acción", "Destino", "Volumen (USD)", "Gas"]],
    body: txRows.length > 0 ? txRows : [["Sin transacciones", "-", "-", "-", "-"]],
    margin: { left: margin },
    theme: "plain",
    styles: { fontSize: 7 },
    headStyles: { fillColor: [51, 65, 85], textColor: 255, fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 60 },
      2: { cellWidth: 35 },
      3: { cellWidth: 32 },
      4: { cellWidth: 25 },
    },
  })
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5

  if ((result.transactions ?? []).length > 30) {
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text(`... y ${result.transactions!.length - 30} transacciones más`, margin, y)
    y += 6
  }

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text("— Prisma · Aleph Hackathon 2026 · Powered by GenLayer & Avalanche", margin, Math.min(y, 285))
  doc.save(`prisma-reporte-${walletAddress.slice(2, 10)}.pdf`)
}
