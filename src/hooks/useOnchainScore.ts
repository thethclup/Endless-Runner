// src/hooks/useOnchainScore.ts
import { useState } from 'react';
import { useAccount, useSwitchChain, useSendTransaction, useSendCalls, useConfig } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { base } from 'wagmi/chains';
import { Attribution } from 'ox/erc8021';
import { BUILDER_CODE } from '../lib/erc8021/constants';
import { ScoreData } from '../types';
import { getCallsStatus } from 'wagmi/actions';

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
  const [error, setError] = useState<string | null>(null);

  const submitScore = async (scoreData: ScoreData) => {
    if (!isConnected || !address) return false;
    setError(null);
    try {
      setIsSubmitting(true);
      setTxHash(null);
      if (chainId !== base.id) {
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
          ""
        ],
      });
      const dataSuffix = Attribution.toDataSuffix({ codes: [BUILDER_CODE] });
      
      let hash: string = '';
      try {
          const result = await sendCallsAsync({
              calls: [{ to, value: 0n, data }],
              capabilities: { dataSuffix: { value: dataSuffix, optional: true } } as any
          });
          
          while (true) {
              const callsStatus = await getCallsStatus(config, { id: result.id });
              if (callsStatus.status === 'success') {
                  hash = callsStatus.receipts?.[0]?.transactionHash || result.id;
                  break;
              } else if (callsStatus.status === 'failure') {
                  throw new Error('Transaction failed');
              }
              await new Promise(resolve => setTimeout(resolve, 1000));
          }
      } catch (err) {
          hash = await sendTransactionAsync({
              to,
              value: 0n,
              data: `${data}${dataSuffix.slice(2)}` as `0x${string}`
          });
      }

      if (hash) {
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

  return { submitScore, isSubmitting, txHash, error };
}

