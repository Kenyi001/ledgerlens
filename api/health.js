/**
 * GET /api/health - Estado del servicio (útil para Vercel/monitoring)
 */
export default function handler(req, res) {
  res.status(200).json({ status: "ok", service: "ledgerlens-backend" });
}
