import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { createClient } from 'viem'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
  ],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
})
