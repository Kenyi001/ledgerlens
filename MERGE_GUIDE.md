# Guía para unir ramas: GenLayer + Avalanche (carla-cambios)

## Ramas a unir

| Rama | Contenido |
|------|-----------|
| `feature/genlayer-validation` | GenLayer StudioNet, scripts de validación, documentación |
| `carla-cambios` | x402, ERC-8004/Agent, phishing detection, mejoras Avalanche/frontend |

## Resultado del merge de prueba

✅ **Merge sin conflictos.** Git auto-fusionó `package.json` correctamente.

### Archivos que se combinan

**De GenLayer (feature/genlayer-validation):**
- `scripts/genlayer-wallet.js`, `validate.js`, `verify-genlayer.js`, `deploy-genlayer.js`
- `src/services/genlayer.service.js` (studionet)
- `CHECKLIST.md`, `GENLAYER.md`, `HACKATHON.md`, `VALIDATION.md`

**De carla-cambios:**
- `src/x402/expressSetup.js`, `scripts/autonomousAgent.js`
- `src/controllers/agent.controller.js`, `src/createApp.js`
- Cambios en `aggregator`, `avalanche.service`, `ai.service`, `analyze.controller`
- Cambios en frontend: `TransactionTable`, `api.ts`, `useRunAnalysis`, etc.
- Nuevas deps: `@x402/*`, `@payai/facilitator`, `viem`

**Compartidos (auto-merge OK):**
- `package.json` — combina scripts GenLayer + deps x402
- `contracts/wallet_analyzer.py` — carla tiene un prompt mejorado (gas 0, Contract/Other); se conserva su versión
- `src/services/ai.service.js` — mantiene integración GenLayer (GenLayer → HF → OpenAI)

## Pasos para unir

### Opción A: Merge en feature/genlayer-validation (recomendado)

```bash
# 1. Asegúrate de tener todo commiteado en feature/genlayer-validation
git checkout feature/genlayer-validation
git status   # debería estar limpio

# 2. Traer carla-cambios y fusionar
git fetch origin
git merge origin/carla-cambios -m "Merge carla-cambios: x402, agent, Avalanche"

# 3. Instalar nuevas dependencias
npm install

# 4. Verificar que todo funciona
npm run validate:build
npm run dev    # en otra terminal
npm run validate
npm run verify:genlayer

# 5. Subir la rama unida
git push origin feature/genlayer-validation
```

### Opción B: Merge en main

```bash
# Primero une en feature/genlayer-validation (pasos arriba)
# Luego crea PR: feature/genlayer-validation → main
# O merge directo:
git checkout main
git merge feature/genlayer-validation -m "Merge GenLayer + Avalanche/x402"
git push origin main
```

## Verificaciones tras el merge

| Prueba | Comando |
|--------|---------|
| Build frontend | `npm run validate:build` |
| API + GenLayer | `npm run dev` + `npm run validate` |
| GenLayer contrato | `npm run verify:genlayer` |
| Variables x402 (opcional) | Ver `.env.example` para X402_* |

## Posibles ajustes post-merge

1. **`.env`**: Añadir variables x402 si usas pagos (ver `carla-cambios` en `.env.example`).
2. **Vercel**: Configurar `GENLAYER_CONTRACT_ADDRESS`, `GENLAYER_PRIVATE_KEY` y variables x402 si aplica.
3. **wallet_analyzer.py**: La versión de carla trae un prompt ajustado (mejor manejo de gas 0, Contract/Other).
