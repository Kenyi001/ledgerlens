/**
 * Configuración centralizada de las blockchains soportadas por LedgerLens.
 */

export const SUPPORTED_CHAINS = {
  avalanche: {
    chainId: "43114",
    label: "Avalanche C-Chain",
    currency: "AVAX",
    explorer: "https://snowtrace.io",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    isGlacier: true
  },
  fuji: {
    chainId: "43113",
    label: "Avalanche Fuji",
    currency: "AVAX",
    explorer: "https://testnet.snowtrace.io",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    isGlacier: true
  },
  ethereum: {
    chainId: "1",
    label: "Ethereum Mainnet",
    currency: "ETH",
    explorer: "https://etherscan.io",
    rpcUrl: process.env.ETH_RPC_URL || "https://eth.llamarpc.com",
    apiType: "etherscan",
    apiUrl: "https://api.etherscan.io/api"
  },
  polygon: {
    chainId: "137",
    label: "Polygon Mainnet",
    currency: "POL",
    explorer: "https://polygonscan.com",
    rpcUrl: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
    apiType: "etherscan",
    apiUrl: "https://api.polygonscan.com/api"
  },
  bsc: {
    chainId: "56",
    label: "BNB Smart Chain",
    currency: "BNB",
    explorer: "https://bscscan.com",
    rpcUrl: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org",
    apiType: "etherscan",
    apiUrl: "https://api.bscscan.com/api"
  }
};

export function getSupportedChains() {
  return Object.keys(SUPPORTED_CHAINS);
}
