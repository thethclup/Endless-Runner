import { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { base } from 'wagmi/chains';
import { useERC8021Transaction } from '../lib/erc8021/hooks/useERC8021Transaction';

const SCORE_CONTRACT_PLACEHOLDER = '0x0000000000000000000000000000000000000000';
const SCORE_ABI = [{
  inputs: [{ internalType: 'uint256', name: 'score', type: 'uint256' }],
  name: 'submitScore', outputs: [], stateMutability: 'nonpayable', type: 'function',
}] as const;

export function useOnchainScore() {
  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransaction } = useERC8021Transaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitScore = async (score: number) => {
    if (!isConnected || !address) return false;
    setError(null);
    try {
      setIsSubmitting(true);
      setTxHash(null);
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id });
      }
      const data = encodeFunctionData({
        abi: SCORE_ABI, functionName: 'submitScore',
        args: [BigInt(Math.floor(score))],
      });
      const hash = await sendTransaction(
        { to: SCORE_CONTRACT_PLACEHOLDER as `0x${string}`, data },
        '[ATTRIBUTION_CODE]', 'bc_1aw46v36',
      );
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
