import { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { base } from 'wagmi/chains';
import { useERC8021Transaction } from '../lib/erc8021/hooks/useERC8021Transaction';
import { ATTRIBUTION_CODE, BUILDER_CODE } from '../lib/erc8021/constants';

const SCORE_CONTRACT_PLACEHOLDER = '0x000000000000000000000000000000000000dEaD';
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
        ATTRIBUTION_CODE, BUILDER_CODE,
      );
      setTxHash(hash);
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

  return { submitScore, isSubmitting, txHash, error };
}
