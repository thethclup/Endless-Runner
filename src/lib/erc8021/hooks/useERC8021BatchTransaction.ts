import { useSendCalls } from 'wagmi';
import { Attribution } from 'ox/erc8021';
import { BUILDER_CODE } from '../constants';

export function useERC8021BatchTransaction() {
  const { sendCallsAsync } = useSendCalls();
  
  const sendBatch = async (transactions: { to: string; value: string; data: string }[]) => {
    const dataSuffix = Attribution.toDataSuffix({ codes: [BUILDER_CODE] });
    const result = await sendCallsAsync({
      calls: transactions.map(tx => ({
        to: tx.to as `0x${string}`,
        value: BigInt(tx.value),
        data: tx.data as `0x${string}`,
      })),
      capabilities: { dataSuffix: { value: dataSuffix, optional: true } } as any,
    });
    return result.id;
  };
  
  return { sendBatch };
}
