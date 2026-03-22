/**
 * Prisma Backend — API de análisis de billeteras Avalanche
 * Aleph Hackathon 2026
 */

import { createApp } from "./createApp.js";

const PORT = process.env.PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`[Prisma] API listening on http://localhost:${PORT}`);
  console.log(`[Prisma] GET /api/analyze/:address — analizar billetera`);
});
