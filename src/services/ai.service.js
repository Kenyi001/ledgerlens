/**
 * Servicio de IA: analiza el comportamiento de la billetera y clasifica (Humano vs Bot)
 * Prioridad: GenLayer (si configurado) → Hugging Face (gratis para pruebas) → OpenAI.
 */

import OpenAI from "openai";

const SYSTEM_PROMPT = `Eres un auditor experto de blockchain. Analiza el siguiente resumen estadístico de las últimas 50 transacciones de una billetera en Avalanche. Debes clasificar la billetera en una de estas 3 categorías de 'identity': 'Verified Human User', 'High-Frequency Trading Bot', o 'Smart Contract Service'. También debes asignar un 'risk_score' del 0 al 100 (donde 100 es alto riesgo de bot/MEV) y generar una 'narrative' de 2 oraciones explicando por qué tomaste esa decisión basándote en los datos. Devuelve la respuesta ESTRICTAMENTE en este formato JSON, sin markdown ni texto adicional: { "identity": "...", "risk_score": 0, "narrative": "..." }`;

/**
 * Envía el resumen estadístico a la IA y obtiene el veredicto.
 * Usa GenLayer si GENLAYER_CONTRACT_ADDRESS está definido; si no, OpenAI.
 * @param {string} statisticalSummary - Resumen generado por el agregador
 * @returns {Promise<{ identity: string, risk_score: number, narrative: string }>}
 */
export async function analyzeWalletBehavior(statisticalSummary) {
  if (process.env.GENLAYER_CONTRACT_ADDRESS && process.env.GENLAYER_PRIVATE_KEY) {
    try {
      const { analyzeWithGenLayer } = await import("./genlayer.service.js");
      return await analyzeWithGenLayer(statisticalSummary);
    } catch (err) {
      console.warn("[ai] GenLayer falló, usando Hugging Face/OpenAI:", err.message);
    }
  }

  const hfToken = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN;
  if (hfToken) {
    try {
      return await analyzeWithHuggingFace(statisticalSummary, hfToken);
    } catch (err) {
      console.warn("[ai] Hugging Face falló, usando OpenAI:", err.message);
    }
  }

  return analyzeWithOpenAI(statisticalSummary);
}

async function analyzeWithHuggingFace(statisticalSummary, token) {
  const model = process.env.HF_MODEL || "meta-llama/Llama-3.3-70B-Instruct:fireworks-ai";
  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: statisticalSummary },
      ],
      temperature: 0.2,
      max_tokens: 220,
    }),
  });

  const rawText = await response.text();
  let data;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { raw: rawText };
  }

  if (!response.ok) {
    throw new Error(
      `Hugging Face error (${response.status}): ${
        typeof data === "string" ? data : JSON.stringify(data)
      }`
    );
  }

  const content =
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    extractHfText(data);
  if (!content) {
    throw new Error("Hugging Face no devolvió texto utilizable.");
  }

  const parsed = parseJsonResponse(content);
  validateVerdict(parsed);
  return parsed;
}

async function analyzeWithOpenAI(statisticalSummary) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "No hay proveedor IA configurado. Usa HUGGINGFACE_API_KEY (o HF_API_TOKEN), OPENAI_API_KEY o GenLayer."
    );
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: statisticalSummary },
    ],
    temperature: 0.3,
  });

  const content = completion.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("La IA no devolvió una respuesta válida.");
  }

  const parsed = parseJsonResponse(content);
  validateVerdict(parsed);
  return parsed;
}

function extractHfText(data) {
  if (Array.isArray(data) && typeof data[0]?.generated_text === "string") {
    return data[0].generated_text.trim();
  }
  if (typeof data?.generated_text === "string") {
    return data.generated_text.trim();
  }
  if (Array.isArray(data) && typeof data[0]?.summary_text === "string") {
    return data[0].summary_text.trim();
  }
  return "";
}

function parseJsonResponse(content) {
  let cleaned = content;
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  // Algunos modelos incluyen texto antes/después del JSON.
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`La IA devolvió JSON inválido: ${content.slice(0, 200)}`);
  }
}

function validateVerdict(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("El veredicto de la IA no es un objeto válido.");
  }
  if (typeof obj.identity !== "string" || !obj.identity.trim()) {
    throw new Error("El veredicto debe incluir 'identity' (string).");
  }
  const score = Number(obj.risk_score);
  if (Number.isNaN(score) || score < 0 || score > 100) {
    throw new Error("El veredicto debe incluir 'risk_score' entre 0 y 100.");
  }
  if (typeof obj.narrative !== "string" || !obj.narrative.trim()) {
    throw new Error("El veredicto debe incluir 'narrative' (string).");
  }
  obj.risk_score = Math.round(score);
}
