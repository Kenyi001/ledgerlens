/**
 * Servicio de extracción de transacciones desde Avalanche Glacier API (L1/C-Chain)
 * Documentación: https://developers.avacloud.io/data-api/address-transactions
 */

const SUPPORTED_CHAINS = {
  avalanche: {
    chainId: "43114",
    label: "Avalanche C-Chain",
  },
  ethereum: {
    chainId: "1",
    label: "Ethereum Mainnet",
  },
};
const GLACIER_BASE_URL = "https://glacier-api.avax.network";
const DEFAULT_PAGE_SIZE = 50;

/**
 * Obtiene las últimas transacciones de una dirección en una chain EVM soportada
 * @param {string} address - Dirección de la billetera (0x...)
 * @param {"avalanche"|"ethereum"} chain - Red a consultar en Glacier
 * @returns {Promise<Array>} Array de transacciones crudas
 */
export async function fetchTransactions(address, chain = "avalanche") {
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

  const network = SUPPORTED_CHAINS[chain];
  if (!network) {
    throw new Error(
      `Chain no soportada: ${chain}. Usa una de: ${Object.keys(SUPPORTED_CHAINS).join(", ")}`
    );
  }

  const url = `${GLACIER_BASE_URL}/v1/chains/${network.chainId}/addresses/${normalizedAddress}/transactions?pageSize=${DEFAULT_PAGE_SIZE}&sortOrder=desc`;

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

export function getSupportedChains() {
  return Object.keys(SUPPORTED_CHAINS);
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
