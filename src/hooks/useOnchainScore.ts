import { useState } from 'react';
import { useAccount } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { useERC8021Transaction } from '../lib/erc8021/hooks/useERC8021Transaction';

const SCORE_CONTRACT_PLACEHOLDER = "0x0000000000000000000000000000000000000000";

const SCORE_ABI = [{
    "inputs": [
        { "internalType": "uint256", "name": "score", "type": "uint256" }
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}] as const;

export function useOnchainScore() {
    const { address, isConnected } = useAccount();
    const { sendTransaction } = useERC8021Transaction();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    const submitScore = async (score: number) => {
        if (!isConnected || !address) return false;

        try {
            setIsSubmitting(true);
            setTxHash(null);
            
            // Encode function call to store score on chain
            const data = encodeFunctionData({
                abi: SCORE_ABI,
                functionName: 'submitScore',
                args: [BigInt(Math.floor(score))]
            });

            // Use the Hook that automatically adds the ERC8021 Suffix
            const hash = await sendTransaction({
                to: SCORE_CONTRACT_PLACEHOLDER,
                data: data
            }, "[ATTRIBUTION_CODE]", "bc_1aw46v36");
            
            console.log("Recorded score on-chain with tx:", hash);
            setTxHash(hash);
            return hash;
        } catch (error) {
            console.error("Score submission failed:", error);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submitScore, isSubmitting, txHash };
}
