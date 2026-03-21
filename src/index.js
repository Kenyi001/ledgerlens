/**
 * LedgerLens Backend — API de análisis de billeteras Avalanche
 * Aleph Hackathon 2026
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzeAddress } from "./controllers/analyze.controller.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok", service: "ledgerlens-backend" });
});

app.get("/api/analyze/:address", analyzeAddress);

app.use((_, res) => {
  res.status(404).json({ error: "Not Found", message: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`[LedgerLens] API listening on http://localhost:${PORT}`);
  console.log(`[LedgerLens] GET /api/analyze/:address — analizar billetera`);
});
