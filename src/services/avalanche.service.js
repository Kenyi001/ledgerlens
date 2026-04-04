import { SUPPORTED_CHAINS } from "./chains.js";

const GLACIER_BASE_URL = "https://glacier-api.avax.network";
const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGES = 5;

/**
 * Obtiene las últimas transacciones de una dirección en una chain EVM soportada
 * @param {string} address - Dirección de la billetera (0x...)
 * @param {string} chain - Red a consultar
 * @returns {Promise<Array>} Array de transacciones formateadas
 */
export async function fetchTransactions(address, chain = "avalanche") {
  const normalizedAddress = address.trim().toLowerCase();
  const network = SUPPORTED_CHAINS[chain];
  if (!network) throw new Error(`Chain no soportada: ${chain}`);

  if (network.isGlacier) {
    return fetchFromGlacier(normalizedAddress, network);
  } else if (network.apiType === "etherscan") {
    return fetchFromEtherscan(normalizedAddress, chain);
  }
  
  return [];
}

async function fetchFromGlacier(address, network) {
  const apiKey = process.env.GLACIER_API_KEY;
  if (!apiKey) throw new Error("GLACIER_API_KEY no configurada.");

  let rawTransactions = [];
  let nextToken = null;
  let pagesFetched = 0;

  do {
    const pSize = DEFAULT_PAGE_SIZE.toString();
    let url = `${GLACIER_BASE_URL}/v1/chains/${network.chainId}/addresses/${address}/transactions?pageSize=${pSize}&sortOrder=desc`;
    if (nextToken) url += `&pageToken=${nextToken}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "x-glacier-api-key": apiKey, Accept: "application/json" },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Glacier API error (${response.status}): ${text}`);
    }

    const data = await response.json();
    const batch = data.transactions ?? [];
    rawTransactions = rawTransactions.concat(batch);
    nextToken = data.nextPageToken;
    pagesFetched++;
  } while (nextToken && pagesFetched < MAX_PAGES);

  return rawTransactions.map((tx) => extractUsefulData(tx, address));
}

async function fetchFromEtherscan(address, chain) {
  const network = SUPPORTED_CHAINS[chain];
  const envKey = `${chain.toUpperCase()}_API_KEY`;
  const apiKey = process.env[envKey] || "YourApiKeyToken"; // Etherscan permite llamadas básicas sin key aveces

  const url = `${network.apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${DEFAULT_PAGE_SIZE}&sort=desc&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "1") {
    if (data.message === "No transactions found") return [];
    throw new Error(`Etherscan API error (${chain}): ${data.result || data.message}`);
  }

  // Mapeamos el formato Etherscan al formato unificado de LedgerLens
  return data.result.map(tx => ({
    hash: tx.hash,
    timestamp: Number(tx.timeStamp),
    from: tx.from.toLowerCase(),
    to: tx.to?.toLowerCase(),
    value: parseBigInt(tx.value),
    gasUsed: parseBigInt(tx.gasUsed),
    gasPrice: parseBigInt(tx.gasPrice),
    cumulativeGasUsed: parseBigInt(tx.cumulativeGasUsed),
    methodName: tx.functionName || "",
    primaryErc20: null // TODO: Implementar fetchErc20 para Etherscan si se requiere
  }));
}

export function getSupportedChains() {
  return Object.keys(SUPPORTED_CHAINS);
}

/**
 * Obtiene el balance nativo via RPC.
 */
export async function fetchNativeBalance(address, chain = "avalanche") {
  const network = SUPPORTED_CHAINS[chain] || SUPPORTED_CHAINS.avalanche;
  const url = network.rpcUrl;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address, "latest"]
      })
    });
    const data = await res.json();
    return BigInt(data.result || "0x0");
  } catch (e) {
    console.error(`fetchNativeBalance error (${chain}):`, e);
    return 0n;
  }
}

/** Parsea valor a BigInt (Glacier puede enviar string, number o hex). */
function parseBigInt(val) {
  if (val == null || val === "") return 0n;
  try {
    return BigInt(val);
  } catch {
    return 0n;
  }
}

/**
 * Resume ERC-20 más relevante para la wallet (como en Core: “9 USDC”, etc.).
 */
function summarizeErc20ForWallet(erc20Transfers, walletLower) {
  if (!Array.isArray(erc20Transfers) || erc20Transfers.length === 0) return null;
  const w = walletLower.toLowerCase();

  const rows = erc20Transfers.map((t) => {
    const from = String(t.from?.address ?? t.from ?? "").toLowerCase();
    const to = String(t.to?.address ?? t.to ?? "").toLowerCase();
    const tok = t.erc20Token ?? {};
    const decimals = Number(tok.decimals ?? 18);
    const rawVal = parseBigInt(t.value);
    const amountHuman =
      decimals > 0 ? Number(rawVal) / 10 ** Math.min(decimals, 36) : 0;
    const unitPrice = tok.price?.value != null ? Number(tok.price.value) : null;
    const valueUsd =
      unitPrice != null && Number.isFinite(amountHuman)
        ? amountHuman * unitPrice
        : null;
    return { from, to, amountHuman, symbol: tok.symbol || "?", valueUsd };
  });

  const involving = rows.filter((r) => r.from === w || r.to === w);
  const pool = involving.length ? involving : rows;
  if (pool.length === 0) return null;

  pool.sort(
    (a, b) =>
      Math.abs(b.valueUsd ?? b.amountHuman ?? 0) -
      Math.abs(a.valueUsd ?? a.amountHuman ?? 0)
  );
  const best = pool[0];
  let direction = "neutral";
  if (best.from === w) direction = "out";
  else if (best.to === w) direction = "in";

  return {
    amountHuman: Math.round(best.amountHuman * 1e6) / 1e6,
    symbol: best.symbol,
    valueUsd:
      best.valueUsd != null ? Math.round(best.valueUsd * 100) / 100 : null,
    direction,
  };
}

/**
 * Extrae información útil de cada ítem de Glacier (native + erc20Transfers).
 */
function extractUsefulData(tx, walletAddressLower) {
  const native = tx.nativeTransaction ?? tx;
  const to = native.to ?? {};
  const fromObj = native.from ?? {};
  const method = native.method ?? {};

  const gasUsed = parseBigInt(native.gasUsed);
  const gasPrice = parseBigInt(native.gasPrice);
  const effectiveGasPrice = parseBigInt(native.effectiveGasPrice);
  const transactionFeeWei = parseBigInt(
    native.transactionFee ?? native.fee ?? native.txFee
  );

  const primaryErc20 = summarizeErc20ForWallet(
    tx.erc20Transfers,
    walletAddressLower
  );

  return {
    hash: native.txHash ?? native.hash ?? null,
    timestamp: native.blockTimestamp
      ? Number(native.blockTimestamp)
      : native.timestamp
        ? Number(native.timestamp)
        : null,
    from: (typeof fromObj === "object" ? fromObj.address : fromObj) ?? null,
    to: (typeof to === "object" ? to.address : to) ?? null,
    toName: typeof to === "object" ? to.name : null,
    toSymbol: typeof to === "object" ? to.symbol : null,
    value: parseBigInt(native.value),
    gasUsed,
    gasPrice,
    effectiveGasPrice,
    transactionFeeWei,
    gasLimit: parseBigInt(native.gasLimit),
    callType: method.callType ?? "UNKNOWN",
    methodHash: method.methodHash ?? "",
    methodName: method.methodName ?? "",
    status: (native.txStatus ?? native.status) != null ? String(native.txStatus ?? native.status) : null,
    primaryErc20,
  };
}
