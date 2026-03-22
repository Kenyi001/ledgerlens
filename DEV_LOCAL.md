# Comprobar el proyecto en local

## Iniciar todo

Abre **dos terminales** en la raíz del proyecto:

### Terminal 1 — Backend

```bash
npm run dev
```

Servidor en: **http://localhost:3001**

### Terminal 2 — Frontend

```bash
cd ledgerlens-front
npm run dev
```

Frontend en: **http://localhost:5173**

---

## Qué probar

1. Abre **http://localhost:5173** en el navegador.
2. Conecta MetaMask o Core (Avalanche C-Chain).
3. Pega una dirección (ej. `0x8dc08e5055e49b6F9d96aDC4AC277fDe44028367`).
4. Elige **Avalanche** y haz clic en **Analizar**.
5. Revisa: identity, risk_score, transacciones, gráfico de gas.

---

## Verificaciones previas

```bash
# Build del frontend
npm run validate:build

# API (con backend corriendo en otra terminal)
npm run validate

# GenLayer
npm run verify:genlayer
```

---

## Variables en .env

- `GLACIER_API_KEY` — obligatoria (Avalanche Glacier).
- `HUGGINGFACE_API_KEY` o `OPENAI_API_KEY` — para IA.
- `GENLAYER_CONTRACT_ADDRESS` y `GENLAYER_PRIVATE_KEY` — para GenLayer (opcional; si están, se usa Bradbury).

---

## Problemas frecuentes

- **Puerto 3001 en uso:** Cierra otros procesos que usen 3001 o ejecuta `npx kill-port 3001`.
- **Frontend no carga:** Asegúrate de que el backend esté corriendo antes de analizar.
