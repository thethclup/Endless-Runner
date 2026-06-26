import { useSendCalls } from 'wagmi';

export function useERC8021BatchTransaction() {
  const { sendCallsAsync } = useSendCalls();
  
  const sendBatch = async (transactions: { to: string; value: string; data: string }[]) => {
    const result = await sendCallsAsync({
      calls: transactions.map(tx => ({
        to: tx.to as `0x${string}`,
        value: BigInt(tx.value),
        data: tx.data as `0x${string}`,
      }))
    });
    return result.id;
  };
  
  return { sendBatch };
}
