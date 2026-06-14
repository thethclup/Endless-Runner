import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';
import { Attribution } from 'ox/erc8021';

const metaEnv = (import.meta as any).env || {};
const builderCode = metaEnv.VITE_BUILDER_CODE || 'bc_1aw46v36';
const DATA_SUFFIX = Attribution.toDataSuffix({ codes: [builderCode] });

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Endless Runner Dash' }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
  dataSuffix: DATA_SUFFIX,
} as any);

