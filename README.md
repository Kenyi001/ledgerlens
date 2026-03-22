# Prisma

> **Analizador financiero on-chain** para billeteras Avalanche y Ethereum. Extrae transacciones, clasifica **Humano vs Bot** con IA y ofrece dashboards de ingresos, gastos y gas.
>
> **Aleph Hackathon 2026**

→ [HACKATHON.md](./HACKATHON.md) · [CHECKLIST.md](./CHECKLIST.md) · [SCAM_DETECTION.md](./SCAM_DETECTION.md) · [X402.md](./X402.md) · [GENLAYER.md](./GENLAYER.md)

---

## Para jurados y calificadores

Este documento resume el **stack tecnológico**, cómo se usaron las **tecnologías de cada pool de premios** y qué se implementó correctamente.

### Tracks / Pools de premios

| Track | Tecnologías requeridas | Uso en Prisma |
|-------|------------------------|---------------|
| **Avalanche** | Glacier API, C-Chain, build.avax.network | ✅ Glacier API como fuente de datos on-chain; soporte Avalanche C-Chain (43114) y Fuji (43113); enlaces a Snowtrace |
| **GenLayer** | Intelligent Contracts, Testnet Bradbury, consenso LLM | ✅ Contrato desplegado en Bradbury; IA descentralizada con fallback a OpenAI/Hugging Face |
| **x402** | HTTP 402, pago USDC, Avalanche | ✅ Middleware x402 en backend; pago USDC vía PayAI en Fuji/C-Chain; cliente frontend con wrapFetchWithPayment |

### Stack tecnológico completo

| Capa | Tecnología | Versión / Uso |
|------|------------|---------------|
| **Frontend** | React 19, Vite 8, TypeScript, Tailwind 4 | SPA con HMR |
| **Estado / Wallet** | wagmi 3, viem 2 | Conexión MetaMask, Core; chains Avalanche, Fuji, Ethereum |
| **Gráficos** | Recharts | Dashboards de ingresos/gastos, gas |
| **Backend** | Node.js, Express, ES Modules | API REST; serverless en Vercel |
| **L1 Datos** | Avalanche Glacier API | Transacciones, balances; Avalanche + Ethereum |
| **IA** | Hugging Face, OpenAI, GenLayer | Clasificación Humano/Bot; consenso LLM vía GenLayer |
| **Pagos API** | x402, @x402/core, @x402/express, @x402/evm, PayAI | Cobro USDC opcional por análisis |
| **GenLayer** | genlayer-js | Intelligent Contract en Bradbury |

### Qué se implementó correctamente

1. **Avalanche Glacier API**: Integración completa; transacciones, ERC-20, método de llamada; soporte C-Chain y Fuji.
2. **GenLayer**: Contrato desplegado; consenso optimista; fallback a proveedores centralizados si falla.
3. **x402**: Backend con middleware de pago; frontend con cliente x402; pago USDC en Avalanche.
4. **Detección de scam**: Heurísticas (cirílico, transferencias sin valor); clasificación por tipo; documentado en SCAM_DETECTION.md.
5. **Dashboard financiero**: Ingresos/gastos en el tiempo; gas en el tiempo; tipo de cuenta destino (DEX, Bridge, Wallet, Contrato).
6. **Export PDF**: Reporte descargable con clasificación, narrativa y transacciones.
7. **Wallet connect**: MetaMask y injected; uso de useConnectors (wagmi v3).

---

## Stack (resumen)

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite + TypeScript + Tailwind + wagmi + Recharts |
| Backend | Node.js + Express + ES Modules + Vercel Serverless |
| L1 Datos | Avalanche Glacier API (C-Chain + Ethereum) |
| IA | Hugging Face → OpenAI → GenLayer (fallback) |
| Wallet | MetaMask / Core (Avalanche + Ethereum) |
| Pagos API | x402 + PayAI facilitator (Avalanche Fuji / C-Chain) |

### Built for Avalanche

Prisma usa **Glacier** para datos, **Avalanche C-Chain / Fuji** para análisis, y **x402** para cobro opcional en USDC. Ver [X402.md](./X402.md) y [GENLAYER.md](./GENLAYER.md).

---

## Variables de entorno

| Variable | Obligatoria | Uso |
|----------|-------------|-----|
| `GLACIER_API_KEY` | Sí | [AvaCloud](https://app.avacloud.io/) — transacciones on-chain |
| `HUGGINGFACE_API_KEY` o `OPENAI_API_KEY` | Sí | IA para clasificación |
| `GENLAYER_PRIVATE_KEY` | GenLayer | Deploy y llamadas al contrato |
| `GENLAYER_CONTRACT_ADDRESS` | GenLayer | Dirección del contrato |
| `X402_ENABLED`, `X402_PAY_TO`, `X402_NETWORK` | x402 | Cobro por API en USDC |
| `AVAX_USD_PRICE` | No | Precio AVAX para cálculos USD |

---

## Desarrollo local

```bash
# Backend
npm install && npm run dev   # http://localhost:3001

# Frontend
cd ledgerlens-front && npm install && npm run dev   # http://localhost:5173
```

---

## Despliegue (Vercel)

1. Conecta el repo de GitHub a Vercel.
2. **Build Command:** `cd ledgerlens-front && npm install && npm run build`
3. **Output Directory:** `ledgerlens-front/dist`
4. Añade las variables de entorno requeridas.

---

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servicio |
| GET | `/api/analyze/:address` | Analiza billetera (?chain=avalanche\|fuji\|ethereum) |

---

## Licencia

MIT · Aleph Hackathon 2026
