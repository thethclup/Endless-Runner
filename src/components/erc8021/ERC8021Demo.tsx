import React, { useState } from 'react';
import { useERC8021Transaction } from '../../lib/erc8021/hooks/useERC8021Transaction';
import { useAccount, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';

export function ERC8021Demo() {
    const { isConnected, address, chainId } = useAccount();
    const { switchChainAsync } = useSwitchChain();
    const { sendTransaction, isPending } = useERC8021Transaction();
    const [txHash, setTxHash] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSendAttributedTx = async () => {
        if (!isConnected || !address) return alert("Connect wallet first!");
        setError(null);
        
        try {
            if (chainId !== base.id) {
                await switchChainAsync({ chainId: base.id });
            }
            // Send 0 ETH to burn address to demonstrate calldata attribution
            const tx = await sendTransaction({
                to: '0x000000000000000000000000000000000000dEaD',
                value: 0n,
                data: '0x' 
            });
            setTxHash(tx);
        } catch (err: any) {
            console.error("Transaction Error:", err);
            setError(err?.shortMessage ?? err?.message ?? 'Transaction failed');
        }
    };

    return (
        <div className="p-4 border border-cyan-500/30 rounded-xl bg-black/40 backdrop-blur-sm space-y-4">
            <h3 className="text-xl font-bold uppercase tracking-widest text-cyan-400">ERC-8021 Base Extractor</h3>
            <p className="text-xs text-slate-400">Sends a 0-value transaction appending current attribution properties directly into the calldata suffix.</p>
            
            {txHash && (
                <div className="p-2 border border-green-500/20 bg-green-900/20 rounded">
                    <p className="text-xs font-mono text-green-400 truncate">Hash: {txHash}</p>
                </div>
            )}

            <button 
                onClick={handleSendAttributedTx}
                disabled={isPending || !isConnected}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-bold transition-all disabled:opacity-50 text-sm uppercase tracking-widest"
            >
                {isPending ? 'Sending...' : 'Test Attribution Payload'}
            </button>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}
