import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http()
});

async function run() {
  const code = await client.getCode({ address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' });
  console.log('USDC code length:', code?.length);
  const codeWeth = await client.getCode({ address: '0x4200000000000000000000000000000000000006' });
  console.log('WETH code length:', codeWeth?.length);
}
run();
