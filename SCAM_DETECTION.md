# Detección de Scam y Verificaciones en Prisma

## Cómo se detecta actividad sospechosa

El backend clasifica transacciones como sospechosas (`is_scam`) según tres reglas heurísticas, aplicadas **antes** de enviar datos a la IA:

### 1. Token con caracteres cirílicos (`cyrillic_token`)

- **Qué comprueba:** El símbolo del token (ej. USDC, WAVAX) contiene caracteres del alfabeto cirílico (ruso, ucraniano, etc.).
- **Por qué:** Tokens falsos suelen imitar nombres legítimos con caracteres que parecen latinos pero son cirílicos (ej. "USDC" con una С cirílica).
- **Etiqueta en UI:** ESTAFA

### 2. Etiqueta de acción con caracteres cirílicos (`cyrillic_action`)

- **Qué comprueba:** La descripción de la acción (derivada de `methodName`, selectores, ERC-20) contiene caracteres cirílicos.
- **Por qué:** Mensajes de phishing o descriptores engañosos pueden usar cirílico para pasar filtros básicos.
- **Etiqueta en UI:** ESTAFA

### 3. Transferencia sin valor (`zero_value`)

- **Qué comprueba:** La transacción es un "transfer" pero:
  - Valor nativo (AVAX/ETH) = 0
  - Cantidad de token = 0 o indefinida
- **Por qué:** Suele ser spam, dust, intentos fallidos o ataques de “approve” que no movieron fondos.
- **Etiqueta en UI:** SIN VALOR (ámbar) — no siempre es estafa; puede ser fallida o spam.

## Diferenciación en el dashboard

| Etiqueta | Color   | Significado                                              |
|----------|---------|----------------------------------------------------------|
| ESTAFA   | Naranja | Posible estafa (caracteres sospechosos)                  |
| SIN VALOR| Ámbar   | Transferencia sin valor (fallida, spam o dust)           |

## Otras comprobaciones

- **Exclusión de scam en métricas:** Las transacciones marcadas como scam no se incluyen en:
  - Total recibido / enviado (USD)
  - Gas gastado
  - Gráficos de ingresos/gastos
  - Conteo de direcciones y acciones para la IA

- **Gas:** Solo se cuenta el gas de transacciones **no scam** y donde `gas_paid_by_me` es verdadero (eres el `from`).

- **IA:** El resumen estadístico que recibe la IA **excluye** las transacciones scam, para que la narrativa se base en actividad legítima.

## Limitaciones

- No hay verificación on-chain de si una dirección es contrato o EOA.
- No se comprueban listas negras de direcciones.
- La clasificación es heurística; puede haber falsos positivos o negativos.
- Para `zero_value`, no distinguimos automáticamente entre “fallida” y “spam”; se agrupan bajo SIN VALOR.
