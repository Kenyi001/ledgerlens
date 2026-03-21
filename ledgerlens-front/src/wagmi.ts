import { createConfig, http } from "wagmi"
import { avalanche, mainnet } from "wagmi/chains"
import { injected, metaMask } from "wagmi/connectors"

/**
 * Avalanche C-Chain + Ethereum mainnet para análisis y pruebas con Core / MetaMask (EIP-1193).
 */
export const config = createConfig({
  chains: [avalanche, mainnet],
  transports: {
    [avalanche.id]: http(),
    [mainnet.id]: http(),
  },
  connectors: [
    metaMask(),
    injected({ shimDisconnect: true }),
  ],
})

export const chainIdForApp = {
  avalanche: avalanche.id,
  ethereum: mainnet.id,
} as const
