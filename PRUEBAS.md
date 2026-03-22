# Cómo hacer la demo y pruebas — Prisma

Guía para quien presenta la demo o valida que todo funcione.

---

## 1. Variables de entorno (obligatorias)

Copia `.env.example` a `.env` y rellena:

| Variable | Dónde obtener | Uso |
|----------|---------------|-----|
| `GLACIER_API_KEY` | [AvaCloud](https://app.avacloud.io/) | Transacciones on-chain |
| `HUGGINGFACE_API_KEY` o `OPENAI_API_KEY` | [Hugging Face](https://huggingface.co/settings/tokens) / [OpenAI](https://platform.openai.com/api-keys) | IA para clasificación |
| `GENLAYER_PRIVATE_KEY` | `npm run genlayer:wallet` | Contrato GenLayer (opcional) |
| `GENLAYER_CONTRACT_ADDRESS` | `npm run deploy:genlayer` | Dirección del contrato (opcional) |

**Opcionales:** `AVAX_USD_PRICE`, `ETH_RPC_URL`, `X402_ENABLED`, `X402_PAY_TO`, etc.

---

## 2. Desarrollo local

```bash
# Terminal 1 — Backend
npm install && npm run dev   # http://localhost:3001

# Terminal 2 — Frontend
cd ledgerlens-front && npm install && npm run dev   # http://localhost:5173
```

---

## 3. Comprobar que funciona

| Paso | Acción | Resultado esperado |
|------|--------|--------------------|
| 1 | `curl http://localhost:3001/api/health` | `{"status":"ok"}` |
| 2 | `npm run verify:genlayer` | OK si GenLayer configurado |
| 3 | `npm run validate` | OK (backend debe estar corriendo) |
| 4 | Abrir http://localhost:5173 | Página de Prisma carga |
| 5 | Pegar dirección `0x8dc08e5055e49b6F9d96aDC4AC277fDe44028367` | Análisis muestra datos |
| 6 | Selector **Avalanche / Fuji / Ethereum** | Cambia la red a analizar |
| 7 | **Connect wallet** → MetaMask/Core | Conecta, permite "Analyze Me" |
| 8 | **Download PDF** | Descarga reporte con tablas |

---

## 4. Flujo para la demo (3 min)

1. **Intro:** "Prisma analiza billeteras on-chain con IA."
2. **Selector de red:** Avalanche, Fuji o Ethereum.
3. **Pegar dirección** o **Connect wallet** → **Analyze Me**.
4. **Resultados:** Identidad, riesgo, narrativa, dashboards (ingresos/gastos, gas).
5. **Transacciones sospechosas:** Hover en badge ESTAFA/SIN VALOR para ver explicación.
6. **Descargar PDF:** Botón para reporte completo.
7. (Opcional) Si x402 activo: mostrar pago USDC y badge "x402 · Pago USDC".

---

## 5. Despliegue en Vercel

1. Conecta el repo a [Vercel](https://vercel.com) (Add New → Project).
2. **Build Command:** `cd ledgerlens-front && npm install && npm run build`
3. **Output Directory:** `ledgerlens-front/dist`
4. Añade variables: `GLACIER_API_KEY`, `HUGGINGFACE_API_KEY` (u `OPENAI_API_KEY`), y opcionales.
5. **Redeploy** para aplicar variables.

O con CLI:

```bash
npm i -g vercel
vercel --prod
```

---

## 6. Verificación en producción

- **Frontend:** `https://tu-proyecto.vercel.app/`
- **Health:** `https://tu-proyecto.vercel.app/api/health`
- **API directa:** `https://tu-proyecto.vercel.app/api/analyze/0x8dc08e5055e49b6F9d96aDC4AC277fDe44028367?chain=avalanche`

---

## 7. Direcciones de prueba

| Red | Dirección (ejemplo) |
|-----|---------------------|
| Avalanche | `0x8dc08e5055e49b6F9d96aDC4AC277fDe44028367` |
| Ethereum | Cualquier dirección con historial en Etherscan |
| Fuji | Dirección con txs en testnet |

---

## 8. Errores frecuentes

| Error | Causa | Solución |
|-------|-------|----------|
| `GLACIER_API_KEY no configurada` | Falta variable | Añadir en `.env` y Vercel |
| `No hay proveedor IA` | Sin HF/OpenAI key | Configurar `HUGGINGFACE_API_KEY` u `OPENAI_API_KEY` |
| Timeout 504 en Vercel | Límite 10 s (Hobby) | Plan Pro o `maxDuration: 60` en vercel.json |
| "Conecta tu wallet" al analizar | x402 activo sin wallet | Conectar MetaMask/Core o desactivar x402 |
