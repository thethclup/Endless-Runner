import { useState } from 'react';
import { useAccount, useSendTransaction, useSendCalls } from 'wagmi';
import { toHex } from 'viem';

export function useOnchainScore() {
  const { address, isConnected, connector } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { sendCallsAsync } = useSendCalls();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitScore = async (score: number) => {
    if (!isConnected || !address) return false;

    setError(null);
    try {
      setIsSubmitting(true);
      setTxHash(null);
      
      const data = toHex(`Void Hunter Depth: ${Math.floor(score)}m`);

      let hash;
      const isCoinbaseWallet = connector?.id === 'coinbaseWalletSDK';
      
      if (isCoinbaseWallet) {
        // EIP-5792 sendCalls for smart wallets
        const callHash = await sendCallsAsync({
          calls: [{
            to: address,
            data,
            value: 0n,
          }]
        });
        hash = callHash; // this is technically a call bundle ID, but usable for UI tracking
      } else {
        // Fallback to standard sendTransaction for EOAs
        hash = await sendTransactionAsync({
          to: address,
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

