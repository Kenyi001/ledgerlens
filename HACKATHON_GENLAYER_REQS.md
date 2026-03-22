# Prisma — Cumplimiento requisitos GenLayer (Aleph + Hackathon oficial)

## Requisitos técnicos del track GenLayer

| Requisito | Descripción | Estado Prisma |
|-----------|-------------|-------------------|
| **Contrato Inteligente** | Python, genlayer SDK | ✅ `contracts/wallet_analyzer.py` |
| **Consenso optimista de la democracia** | Leader propone, validadores votan, ventana de apelación | ✅ Usa `gl.vm.run_nondet_unsafe(leader_fn, validator_fn)` — GenLayer aplica Optimistic Democracy |
| **Principio de equivalencia** | Criterios para que outputs distintos del LLM se consideren equivalentes | ✅ `validator_fn` + `_validate_verdict()` definen equivalencia: estructura JSON, identity, risk_score 0–100, narrative |
| **Despliegue en Testnet Bradbury** | Contrato en Bradbury | ⚠️ **Actual: StudioNet** (faucet vacío). Ver abajo para migrar a Bradbury |

## Submission obligatoria

| Dónde | Link | Estado |
|-------|------|--------|
| **Aleph Hackathon (DoraHacks)** | [Aleph tracks](https://dorahacks.io/hackathon/alephhackathonm26) → seleccionar GenLayer | Por hacer |
| **Hackathon oficial GenLayer** | [DoraHacks GenLayer Bradbury](https://dorahacks.io/hackathon/genlayer-bradbury) o [Portal GenLayer](https://portal.genlayer.foundation/#/hackathon) | Por hacer |

**Ambos hackathons requieren:**
- Repo GitHub público
- Demo video

---

## Cómo cumple Prisma cada requisito

### 1. Consenso optimista de la democracia

El contrato llama `gl.vm.run_nondet_unsafe(leader_fn, validator_fn)`:

- `leader_fn`: ejecuta el prompt al LLM y propone el resultado.
- `validator_fn`: valida que el resultado cumpla los criterios.
- GenLayer asigna un líder aleatorio, los validadores votan, hay ventana de apelación.

### 2. Principio de equivalencia

`_validate_verdict()` define qué se considera equivalente:

- `identity`: string no vacío.
- `risk_score`: entero 0–100.
- `narrative`: string no vacío.

Cualquier salida del LLM que cumpla esto se acepta, aunque el texto varíe.

### 3. Despliegue en Bradbury

**Situación actual:** desplegado en **StudioNet** (sandbox sin tokens) porque el faucet de Bradbury estaba vacío.

**Para cumplir el requisito en Bradbury:**

1. Probar el faucet: https://testnet-faucet.genlayer.foundation/
2. Si hay fondos:
   - Editar `scripts/deploy-genlayer.js` y `src/services/genlayer.service.js`
   - Cambiar `studionet` por `testnetBradbury`
   - Ejecutar `npm run deploy:genlayer`
   - Actualizar `GENLAYER_CONTRACT_ADDRESS` en `.env` y Vercel

---

## Checklist antes de submitir

- [ ] Repo público en GitHub
- [ ] Demo video (en inglés, ~3 min)
- [ ] Submit en Aleph Hackathon → track GenLayer
- [ ] Submit en [GenLayer Hackathon oficial](https://dorahacks.io/hackathon/genlayer-bradbury)
- [ ] (Recomendado) Desplegar en Bradbury cuando el faucet funcione
- [ ] En la descripción, indicar: "Deploy actual en StudioNet; migración a Bradbury pendiente de faucet"

---

## Enlaces

- [GenLayer Docs](https://docs.genlayer.com)
- [Optimistic Democracy](https://docs.genlayer.com/understand-genlayer-protocol/optimistic-democracy-how-genlayer-works)
- [Testnet Bradbury](https://www.genlayer.com/news/announcing-testnet-bradbury)
- [GenLayer Hackathon](https://portal.genlayer.foundation/#/hackathon)
