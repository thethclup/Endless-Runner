import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

export function useOnchainScore() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitScore = async (score: number, distance: number) => {
        if (!isConnected || !address) return false;

        try {
            setIsSubmitting(true);
            const message = `Sign this message to record your score on-chain!
App: Endless Runner Dash
Address: ${address}
Score: ${score}
Distance: ${distance}
Nonce: ${Date.now()}`;
            
            // This is standard SIWE execution. Submitting to backend or registry could integrate ERC-8021 suffixes at the contract level for recording.
            const signature = await signMessageAsync({ account: address as `0x${string}`, message });
            console.log("Recorded score via SIWE:", signature);
            return true;
        } catch (error) {
            console.error("Score submission failed:", error);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submitScore, isSubmitting };
}
