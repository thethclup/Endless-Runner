import { useState } from 'react';
import { useAccount, useConnectorClient, useSendTransaction, useConfig, useSendCalls } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { base } from 'wagmi/chains';

const SCORE_CONTRACT_PLACEHOLDER = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // Replace with a real deployed Leaderboard contract address

const SCORE_ABI = [{
  inputs: [{ internalType: 'uint256', name: 'score', type: 'uint256' }],
  name: 'submitScore', outputs: [], stateMutability: 'nonpayable', type: 'function',
}] as const;

export function useOnchainScore() {
  const { address, isConnected, chainId, connector } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { sendCallsAsync } = useSendCalls();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitScore = async (score: number) => {
    if (!isConnected || !address) return false;
    // Check to prevent transactions to the zero/dead address
    if (!SCORE_CONTRACT_PLACEHOLDER || SCORE_CONTRACT_PLACEHOLDER === '0x0000000000000000000000000000000000000000' || SCORE_CONTRACT_PLACEHOLDER.toLowerCase() === '0x000000000000000000000000000000000000dead') {
      setError("Cannot send transaction to zero/burn address. Please set a valid Leaderboard contract address.");
      return false;
    }

    setError(null);
    try {
      setIsSubmitting(true);
      setTxHash(null);
      
      const data = encodeFunctionData({
        abi: SCORE_ABI, functionName: 'submitScore',
        args: [BigInt(Math.floor(score))],
      });

      let hash;
      const isCoinbaseWallet = connector?.id === 'coinbaseWalletSDK';
      
      if (isCoinbaseWallet) {
        // EIP-5792 sendCalls for smart wallets
        const callHash = await sendCallsAsync({
          calls: [{
            to: SCORE_CONTRACT_PLACEHOLDER as `0x${string}`,
            data,
            value: 0n,
          }]
        });
        hash = callHash; // this is technically a call bundle ID, but usable for UI tracking
      } else {
        // Fallback to standard sendTransaction for EOAs
        hash = await sendTransactionAsync({
          to: SCORE_CONTRACT_PLACEHOLDER as `0x${string}`,
          data,
          value: 0n,
        });
      }
      
      setTxHash(hash);
      return hash;
    } catch (err: any) {
      const msg = err?.shortMessage ?? err?.message ?? 'Transaction failed';
      setError(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitScore, isSubmitting, txHash, error };
}

