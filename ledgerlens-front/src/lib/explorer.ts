/** Enlace a la tx en el explorador según la red del análisis. */
export function getExplorerTxUrl(
  chain: string | undefined,
  txHash: string
): string | null {
  if (!txHash?.startsWith("0x") || txHash.length < 10) return null
  const c = chain?.toLowerCase()
  if (c === "avalanche") return `https://snowtrace.io/tx/${txHash}`
  if (c === "fuji")
    return `https://testnet.snowtrace.io/tx/${txHash}`
  if (c === "ethereum") return `https://etherscan.io/tx/${txHash}`
  if (c === "polygon") return `https://polygonscan.com/tx/${txHash}`
  if (c === "bsc") return `https://bscscan.com/tx/${txHash}`
  return null
}

export function getExplorerAddressUrl(
  chain: string | undefined,
  address: string
): string | null {
  if (!address?.startsWith("0x") || address.length !== 42) return null
  const c = chain?.toLowerCase()
  if (c === "avalanche") return `https://snowtrace.io/address/${address}`
  if (c === "fuji")
    return `https://testnet.snowtrace.io/address/${address}`
  if (c === "ethereum") return `https://etherscan.io/address/${address}`
  if (c === "polygon") return `https://polygonscan.com/address/${address}`
  if (c === "bsc") return `https://bscscan.com/address/${address}`
  return null
}
