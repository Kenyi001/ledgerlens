# Wallet y redes: quitar una conexión y usar otra

## En la app (LedgerLens)

1. **Salir** — Cierra la sesión wagmi en la app (no borra la extensión).
2. **Cambiar wallet** — Desconecta y **abre el menú** para elegir de nuevo **MetaMask** o **Browser wallet (Core, etc.)** sin buscar el botón.
3. Al elegir un conector en el menú, la app **intenta desconectar antes** si había otra sesión activa, para no mezclar dos proveedores.

## Red (Avalanche / Ethereum)

- El selector **Avalanche | Ethereum** define **qué cadena consulta el análisis** en el backend.
- Si la wallet está conectada, la app **pide cambiar de red** en la wallet para alinearla con la opción elegida.
- Si la wallet y el selector “no coinciden”, **cambia el selector** o **acepta el cambio de red** en MetaMask/Core.

## En MetaMask / Core (extensión)

- **Otra cuenta:** icono de cuenta → elige otra dirección; la app actualiza el input al conectar.
- **Otra red:** selector de red en la extensión, o acepta el popup cuando la app pide cambiar de red.
- **Desconectar del sitio:** MetaMask → Conectado → tres puntos → “Desconectar de este sitio” (si quieres resetear por completo).

## Resumen rápido

| Quieres…              | Haz…                                      |
|-----------------------|-------------------------------------------|
| Pasar de Core a MetaMask | **Cambiar wallet** → **MetaMask**      |
| Otra dirección        | Cambiar cuenta en la extensión o **Cambiar wallet** |
| Solo analizar otra red| Selector **Avalanche / Ethereum** (y aceptar en la wallet si pide cambiar red) |
