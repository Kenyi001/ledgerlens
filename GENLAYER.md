# GenLayer - LedgerLens Integration

LedgerLens usa GenLayer para el análisis IA descentralizado (Humano vs Bot) mediante Intelligent Contracts y consenso LLM.

## Arquitectura

```
Frontend → GET /api/analyze/:address
    → Avalanche Glacier (transacciones)
    → Aggregator (formato + resumen)
    → ai.service.js
        ├─ GenLayer (si GENLAYER_* configurado)
        │   └─ wallet_analyzer.py (Intelligent Contract)
        └─ OpenAI (fallback)
```

## Contrato: `contracts/wallet_analyzer.py`

- **`analyze_wallet(statistical_summary: str)`** — write: llama al LLM con consenso, guarda el veredicto.
- **`get_last_verdict()`** — view: devuelve `{ identity, risk_score, narrative }`.

Usa `gl.vm.run_nondet_unsafe` con validador para respuestas JSON no deterministas.

## Desplegar el contrato

### Opción recomendada: StudioNet (sin tokens)

**StudioNet** no requiere GEN del faucet. Solo necesitas una wallet (cualquier private key válida).

**Paso 1 — Crear wallet**

```bash
npm run genlayer:wallet
```

Copia la **private key** e añádela al `.env`:

```
GENLAYER_PRIVATE_KEY=0x...
```

**Paso 2 — Desplegar**

```bash
npm run deploy:genlayer
```

El script usa **StudioNet** por defecto (sin tokens). Al terminar se imprimirá:

```
GENLAYER_CONTRACT_ADDRESS=0x...
```

Cópiala y añádela al `.env`.

**Paso 3 — Reiniciar backend**

```bash
npm run dev
```

### Alternativa: Testnet Bradbury (requiere GEN)

Si quieres desplegar en **Bradbury** (testnet con tokens reales), edita `scripts/deploy-genlayer.js` y cambia `studionet` por `testnetBradbury`. Necesitas obtener 100 GEN del [faucet](https://testnet-faucet.genlayer.foundation/) (puede estar vacío).

---

### Alternativa: GenLayer Studio

1. Entra a [GenLayer Studio](https://studio.genlayer.com)
2. Crea proyecto y pega el código de `contracts/wallet_analyzer.py`
3. Despliega en **Testnet Bradbury** (recomendado para LLM)
4. Copia la dirección del contrato y ponla en `GENLAYER_CONTRACT_ADDRESS`
5. La `GENLAYER_PRIVATE_KEY` debe ser de una wallet que pueda llamar `analyze_wallet` (si usas Studio para deploy, necesitas una key para que el backend ejecute las llamadas)

### Alternativa: GenLayer CLI

```bash
npm install -g @genlayer/cli
genlayer deploy --contract contracts/wallet_analyzer.py --args
```

## Configuración Backend

En `.env`:

```env
# GenLayer (opcional; si no se usa, se usa OpenAI)
GENLAYER_CONTRACT_ADDRESS=0x...
GENLAYER_PRIVATE_KEY=0x...
```

- Si `GENLAYER_CONTRACT_ADDRESS` y `GENLAYER_PRIVATE_KEY` están definidos → se usa GenLayer.
- Si falla GenLayer o no está configurado → se usa OpenAI.

## Cómo funciona la validación (prompt → LLM)

### Flujo del prompt

1. **Backend** recibe una wallet → Glacier (txs) → Agregador genera un `statistical_summary` (texto).
2. **Backend** llama al contrato: `analyze_wallet(statistical_summary)`.
3. **Contrato** construye el prompt completo:
   - Instrucciones fijas: *"Eres un auditor experto de blockchain..."*
   - + el `statistical_summary` que recibe.
4. **Contrato** envía el prompt al LLM (GenLayer): `gl.nondet.exec_prompt(prompt, response_format="json")`.
5. **LLM** devuelve JSON: `{ identity, risk_score, narrative }`.
6. **Contrato** valida el JSON y lo guarda en estado.
7. **Backend** lee `get_last_verdict()` y devuelve el resultado al frontend.

### Verificación (`npm run verify:genlayer`)

El script usa un resumen de prueba fijo:

```
"Total txs: 5. Promedio por día: 2. DEX swaps: 3. Transfers: 2. Gas USD total: 0.5."
```

Ese texto se envía como argumento a `analyze_wallet()`. El contrato lo añade al prompt y el LLM devuelve el veredicto. Así se comprueba que:

- La conexión a StudioNet funciona.
- El contrato acepta escrituras.
- El LLM responde correctamente.
- La lectura de `get_last_verdict` devuelve el JSON esperado.

### En la API real (`/api/analyze/:address`)

El `statistical_summary` es generado por el agregador a partir de las transacciones reales (contadores, gas, acciones, etc.).

## Validación del contrato

### Esquema

```bash
npx genlayer schema contracts/wallet_analyzer.py
```

O con genlayer-js:

```js
const schema = await client.getContractSchemaForCode({
  code: readFileSync("./contracts/wallet_analyzer.py", "utf-8"),
});
```

### Contrato con el frontend

El backend siempre responde:

```json
{
  "identity": "Verified Human User | High-Frequency Trading Bot | Smart Contract Service",
  "risk_score": 0-100,
  "narrative": "...",
  "transactions": [...],
  "gas_efficiency": [...]
}
```

Tanto GenLayer como OpenAI devuelven `identity`, `risk_score` y `narrative` en ese formato.

## Redes GenLayer

| Red             | Uso                                  | Tokens |
|-----------------|--------------------------------------|--------|
| studionet       | Sandbox compartido, **sin tokens**   | No     |
| localnet        | Desarrollo local (Docker)            | No     |
| testnetBradbury | LLM real, producción testnet         | Sí (faucet) |
| testnetAsimov   | Infraestructura y estabilidad        | Sí     |

## Referencias

- [GenLayer Docs](https://docs.genlayer.com)
- [Testnet Bradbury](https://www.genlayer.com/news/announcing-testnet-bradbury)
- [genlayer-js](https://github.com/genlayerlabs/genlayer-js)
