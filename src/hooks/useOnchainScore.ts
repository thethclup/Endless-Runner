// src/hooks/useOnchainScore.ts
import { useState } from 'react';
import { useAccount, useSwitchChain, useSendTransaction, useSendCalls, useConfig } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { base } from 'wagmi/chains';
import { ScoreData } from '../types';
import { getCallsStatus } from 'wagmi/actions';
import { Attribution } from 'ox/erc8021';
import { BUILDER_CODE } from '../lib/erc8021/constants';
import { DENIM_BLOCK_TIME_MS, baseVibenet } from '../lib/denim/constants';

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
});

const SCORE_CONTRACT_ADDRESS = (import.meta as any).env?.VITE_SCORE_CONTRACT || '0x16eA6Ac6236BE861Ca00A77890970fc95470f038';
const SCORE_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "score", type: "uint256" },
      { internalType: "uint256", name: "distance", type: "uint256" },
      { internalType: "uint256", name: "combo", type: "uint256" },
      { internalType: "string", name: "runnerName", type: "string" }
    ],
    name: "submitScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;

export function useOnchainScore() {
  const config = useConfig();
  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendCallsAsync } = useSendCalls();
  const { sendTransactionAsync } = useSendTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [confirmationTimeMs, setConfirmationTimeMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitScore = async (scoreData: ScoreData) => {
    if (!isConnected || !address) return false;
    setError(null);
    const startTime = performance.now();

    try {
      setIsSubmitting(true);
      setTxHash(null);
      setConfirmationTimeMs(null);

      // Support Base Mainnet, Base Sepolia (Denim active), and Base Vibenet (200ms preview)
      const allowedChainIds = [base.id, 84532, baseVibenet.id];
      if (!chainId || !allowedChainIds.includes(chainId)) {
        await switchChainAsync({ chainId: base.id });
      }
      
      const to = SCORE_CONTRACT_ADDRESS as `0x${string}`;
      const data = encodeFunctionData({
        abi: SCORE_ABI, 
        functionName: 'submitScore',
        args: [
          BigInt(Math.floor(scoreData.score)), 
          BigInt(Math.floor(scoreData.distance * 100)), 
          BigInt(Math.floor(scoreData.combo * 10)), 
          "Runner"
        ],
      });

      let hash: string = '';
      try {
        const result = await sendCallsAsync({
          calls: [{ to, value: 0n, data }],
          capabilities: {
            dataSuffix: {
              value: DATA_SUFFIX,
              optional: true,
            },
          },
        });
        
        // Denim 200ms native block confirmation polling
        while (true) {
          const callsStatus = await getCallsStatus(config, { id: result.id });
          if (callsStatus.status === 'success') {
            hash = callsStatus.receipts?.[0]?.transactionHash || result.id;
            break;
          } else if (callsStatus.status === 'failure') {
            throw new Error('Transaction failed onchain');
          }
          // Denim polls every 200ms for instantaneous sub-second resolution
          await new Promise(resolve => setTimeout(resolve, DENIM_BLOCK_TIME_MS));
        }
      } catch (callErr) {
        // Fallback to standard transaction with ERC-8021 dataSuffix
        hash = await sendTransactionAsync({
          to,
          value: 0n,
          data: data as `0x${string}`,
          dataSuffix: DATA_SUFFIX,
        } as any);
      }

      if (hash) {
        const elapsed = Math.round(performance.now() - startTime);
        setConfirmationTimeMs(elapsed);
        setTxHash(hash);
      }
      return hash;
    } catch (err: any) {
      const msg = err?.shortMessage ?? err?.message ?? 'Transaction failed';
      if (msg.includes("internal accounts")) {
        setError("Smart Wallet (EIP-4337) detected. Smart Wallets do not allow 0 ETH transfers + data to EOAs. Please use a standard EOA wallet like MetaMask or a valid Smart Contract address.");
      } else {
        setError(msg);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitScore, isSubmitting, txHash, confirmationTimeMs, error };
}
