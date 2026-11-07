// Base Denim Network Upgrade Constants & Specifications
// Denim replaces Flashblocks with canonical 200ms native blocks (5 blocks per second).
// Denim activated on Base Sepolia on October 21, 2026 at 18:00 UTC.
// Denim activated on Base Mainnet on November 5, 2026 at 18:00 UTC.

import { defineChain } from 'viem';

export const DENIM_BLOCK_TIME_MS = 200; // 5 native canonical blocks / second
export const DENIM_CANONICAL_BLOCK_TAG = 'latest'; // 'pending' tag is removed after Denim

export const DENIM_NETWORKS = {
  baseMainnet: {
    id: 8453,
    name: 'Base Mainnet',
    status: 'ACTIVE ON MAINNET (Activated Nov 5, 2026 at 18:00 UTC · 200ms Blocks Live)',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    native200msBlocks: true,
    activationDate: 'November 5, 2026 at 18:00 UTC',
    isPrimary: true,
  },
  baseSepolia: {
    id: 84532,
    name: 'Base Sepolia',
    status: 'ACTIVE (Activated Oct 21, 2026 at 18:00 UTC · 200ms Blocks Live)',
    rpc: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    native200msBlocks: true,
    activationDate: 'October 21, 2026 at 18:00 UTC',
    isPrimary: false,
  },
  vibenet: {
    id: 84538453,
    name: 'Base Vibenet',
    status: 'LIVE (Developer Preview · 200ms Native Blocks)',
    rpc: 'https://rpc.vibes.base.org',
    explorer: 'https://explorer.vibes.base.org',
    native200msBlocks: true,
    activationDate: 'Experimental Preview',
    isPrimary: false,
  },
} as const;

// Base Vibenet Custom Chain Definition for Wagmi / Viem
export const baseVibenet = defineChain({
  id: 84538453,
  name: 'Base Vibenet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.vibes.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Vibenet Explorer',
      url: 'https://explorer.vibes.base.org',
    },
  },
  testnet: true,
});

// Denim Migration Checklist & Complete Documentation Reference
export const DENIM_MIGRATION_MAPPINGS = [
  {
    legacy: 'wss://mainnet.flashblocks.base.org/ws',
    denim: 'eth_subscribe("newHeads") or eth_subscribe("logs")',
    note: 'Flashblocks WebSocket streams retired; use standard WebSocket RPC from Builder Stack',
  },
  {
    legacy: 'eth_subscribe("newFlashblocks")',
    denim: 'eth_subscribe("newHeads")',
    note: 'Flashblocks stream replaced with canonical 200ms block headers',
  },
  {
    legacy: 'eth_subscribe("pendingLogs")',
    denim: 'eth_subscribe("logs")',
    note: 'Canonical logs subscription across 200ms blocks',
  },
  {
    legacy: 'eth_subscribe("newFlashblockTransactions")',
    denim: 'eth_subscribe("newHeads") + fetch transactions',
    note: 'Canonical block transactions per 200ms tick',
  },
  {
    legacy: 'eth_getBlockByNumber("pending", ...)',
    denim: 'eth_getBlockByNumber("latest", ...)',
    note: 'Pending tag removed; queries read latest canonical 200ms block',
  },
  {
    legacy: 'eth_getBalance(..., "pending")',
    denim: 'eth_getBalance(..., "latest")',
    note: 'Canonical state reflects finalized 200ms execution',
  },
  {
    legacy: 'eth_getTransactionCount(..., "pending")',
    denim: 'eth_getTransactionCount(..., "latest")',
    note: 'Canonical account nonce directly updated in 200ms block',
  },
  {
    legacy: 'eth_call(..., "pending")',
    denim: 'eth_call(..., "latest")',
    note: 'Contract simulations execute against latest canonical state',
  },
  {
    legacy: 'eth_estimateGas(..., "pending")',
    denim: 'eth_estimateGas(..., "latest")',
    note: 'Gas estimation on canonical state',
  },
  {
    legacy: 'eth_simulateV1(..., "pending")',
    denim: 'eth_simulateV1 with canonical state',
    note: 'Simulates directly against latest canonical state',
  },
  {
    legacy: 'base_transactionStatus',
    denim: 'Canonical transaction receipts',
    note: 'Method rejected on public endpoints; read canonical block receipts',
  },
  {
    legacy: 'eth_getTransactionReceipt (preconfirmation)',
    denim: 'Poll eth_getTransactionReceipt for 200ms canonical block',
    note: 'Receipt available immediately once included in 200ms block; no preconfirmed state',
  },
  {
    legacy: 'eth_getTransactionByHash (preconfirmation)',
    denim: 'Canonical transaction data',
    note: 'Block fields are set once transaction lands in canonical 200ms block',
  },
  {
    legacy: 'eth_getLogs(range ending at "pending")',
    denim: 'eth_getLogs(canonical blocks only)',
    note: 'Query logs exclusively from canonical blocks',
  },
  {
    legacy: 'Validity transaction with flashblock_index predicate',
    denim: 'Bound with block_number only',
    note: 'Base rejects flashblock_index predicates after Denim: blocks built every 200ms',
  },
  {
    legacy: 'Historical block hashes (BLOCKHASH window)',
    denim: 'Review history assumptions (covers 1/10th elapsed time)',
    note: '256-block window keeps same entry count, but 200ms blocks mean 51.2s instead of 512s',
  },
] as const;
