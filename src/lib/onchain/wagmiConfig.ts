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
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Endless Runner Dash - Denim 200ms', preference: 'all' }),
  ],
  transports: {
    // Denim: 200ms native blocks polling interval (5 blocks per second)
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
      pollingInterval: DENIM_BLOCK_TIME_MS,
    }),
    [baseSepolia.id]: http('https://sepolia.base.org', {
      batch: true,
      pollingInterval: DENIM_BLOCK_TIME_MS,
    }),
    [baseVibenet.id]: http('https://rpc.vibes.base.org', {
      batch: true,
      pollingInterval: DENIM_BLOCK_TIME_MS,
    }),
  },
  dataSuffix: DATA_SUFFIX,
});
