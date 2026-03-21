/**
 * Servicio de extracción de transacciones desde Avalanche Glacier API (L1/C-Chain)
 * Documentación: https://developers.avacloud.io/data-api/address-transactions
 */

const AVALANCHE_C_CHAIN_ID = "43114";
const GLACIER_BASE_URL = "https://glacier-api.avax.network";
const DEFAULT_PAGE_SIZE = 50;

/**
 * Obtiene las últimas transacciones de una dirección en Avalanche C-Chain
 * @param {string} address - Dirección de la billetera (0x...)
 * @returns {Promise<Array>} Array de transacciones crudas
 */
export async function fetchTransactions(address) {
  const apiKey = process.env.GLACIER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GLACIER_API_KEY no configurada. Obtén una key en https://app.avacloud.io/"
    );
  }

  const normalizedAddress = address.trim().toLowerCase();
  if (!normalizedAddress.startsWith("0x") || normalizedAddress.length !== 42) {
    throw new Error("Dirección inválida. Debe ser una dirección EVM (0x + 40 hex).");
  }

  const url = `${GLACIER_BASE_URL}/v1/chains/${AVALANCHE_C_CHAIN_ID}/addresses/${normalizedAddress}/transactions?pageSize=${DEFAULT_PAGE_SIZE}&sortOrder=desc`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-glacier-api-key": apiKey,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Glacier API error (${response.status}): ${text || response.statusText}`
    );
  }

  const data = await response.json();
  const rawTransactions = data.transactions ?? [];

  return rawTransactions.map(extractUsefulData);
}

/**
 * Extrae solo la información útil de cada transacción cruda
 */
function extractUsefulData(tx) {
  const native = tx.nativeTransaction ?? {};
  const to = native.to ?? {};
  const method = native.method ?? {};

  return {
    hash: native.txHash ?? null,
    timestamp: native.blockTimestamp ? Number(native.blockTimestamp) : null,
    to: to.address ?? null,
    toName: to.name ?? null,
    toSymbol: to.symbol ?? null,
    value: native.value ? BigInt(native.value) : 0n,
    gasUsed: native.gasUsed ? BigInt(native.gasUsed) : 0n,
    gasPrice: native.gasPrice ? BigInt(native.gasPrice) : 0n,
    gasLimit: native.gasLimit ? BigInt(native.gasLimit) : 0n,
    callType: method.callType ?? "UNKNOWN",
    methodHash: method.methodHash ?? "",
    methodName: method.methodName ?? "",
  };
}
