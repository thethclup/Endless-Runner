// Base Denim Network Upgrade Constants & Specifications
// Denim replaces Flashblocks with canonical 200ms native blocks (5 blocks per second).

import { defineChain } from 'viem';

export const DENIM_BLOCK_TIME_MS = 200; // 5 native blocks / second
export const DENIM_CANONICAL_BLOCK_TAG = 'latest'; // 'pending' tag is removed after Denim

export const DENIM_NETWORKS = {
  vibenet: {
    id: 84538453,
    name: 'Base Vibenet',
    status: 'LIVE (Developer Preview - 200ms Native Blocks)',
    rpc: 'https://rpc.vibes.base.org',
    explorer: 'https://explorer.vibes.base.org',
    native200msBlocks: true,
  },
  baseSepolia: {
    id: 84532,
    name: 'Base Sepolia',
    status: 'ACTIVE (Activated Oct 21, 2026 at 18:00 UTC - 200ms Native Blocks)',
    rpc: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    native200msBlocks: true,
  },
  baseMainnet: {
    id: 8453,
    name: 'Base Mainnet',
    status: 'ACTIVE / TARGETING NOV 2026 (200ms Native Blocks)',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    native200msBlocks: true,
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

// Denim Migration Checklist & Documentation Reference
export const DENIM_MIGRATION_MAPPINGS = [
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
    legacy: 'eth_getBlockByNumber("pending")',
    denim: 'eth_getBlockByNumber("latest")',
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
    denim: 'eth_simulateV1(..., "latest")',
    note: 'Simulation against canonical block state',
  },
  {
    legacy: 'eth_getLogs(ending at "pending")',
    denim: 'eth_getLogs(canonical blocks only)',
    note: 'Query logs exclusively from canonical blocks',
  },
] as const;
