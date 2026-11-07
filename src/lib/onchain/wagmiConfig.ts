import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';
import { Attribution } from 'ox/erc8021';
import { BUILDER_CODE } from '../erc8021/constants';
import { baseVibenet, DENIM_BLOCK_TIME_MS } from '../denim/constants';

export { baseVibenet };

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
});

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, baseVibenet],
  pollingInterval: DENIM_BLOCK_TIME_MS, // Wagmi polling interval for Denim 200ms blocks
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Endless Runner Dash - Base Mainnet Denim', preference: 'all' }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
    }),
    [baseSepolia.id]: http('https://sepolia.base.org', {
      batch: true,
    }),
    [baseVibenet.id]: http('https://rpc.vibes.base.org', {
      batch: true,
    }),
  },
  dataSuffix: DATA_SUFFIX,
});
