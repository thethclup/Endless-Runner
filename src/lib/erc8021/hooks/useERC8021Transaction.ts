import { useSendTransaction } from 'wagmi';
import { appendERC8021Calldata } from '../utils';
import { ATTRIBUTION_CODE_PLACEHOLDER, BUILDER_CODE_PLACEHOLDER } from '../constants';

export function useERC8021Transaction() {
    const { sendTransactionAsync, sendTransaction: _origSend, ...status } = useSendTransaction();

    const sendTransactionWithAttribution = async (
        txParams: any, 
        attributionCode = ATTRIBUTION_CODE_PLACEHOLDER, 
        builderCode = BUILDER_CODE_PLACEHOLDER
    ) => {
        const baseCalldata = txParams.data || '0x';
        
        // Append suffix
        const attributedCalldata = appendERC8021Calldata(baseCalldata, {
            schema: 0,
            attributionCode,
            builderCode
        });

        // Send modified transaction
        return sendTransactionAsync({
            ...txParams,
            data: attributedCalldata
        });
    };

    return {
        sendTransaction: sendTransactionWithAttribution,
        ...status
    };
}
