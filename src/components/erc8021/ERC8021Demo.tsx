import React, { useState } from 'react';
import { useAccount, useSwitchChain, useSendTransaction, useSendCalls } from 'wagmi';
import { base } from 'wagmi/chains';

export function ERC8021Demo() {
    const { isConnected, address, chainId } = useAccount();
    const { switchChainAsync } = useSwitchChain();
    const { sendCallsAsync } = useSendCalls();
    const { sendTransactionAsync } = useSendTransaction();
    const [isPending, setIsPending] = useState(false);
    const [txHash, setTxHash] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSendAttributedTx = async () => {
        if (!isConnected || !address) return alert("Connect wallet first!");
        setError(null);
        setIsPending(true);
        
        try {
            if (chainId !== base.id) {
                await switchChainAsync({ chainId: base.id });
            }
            // Send 0 ETH to self to demonstrate calldata attribution
            const to = address;
            const value = 0n;
            const data = '0x';
            
            let tx: string = '';
            try {
                const result = await sendCallsAsync({
                    calls: [{ to, value, data }]
                });
                tx = result.id;
            } catch (err) {
                tx = await sendTransactionAsync({
                    to,
                    value,
                    data: data as `0x${string}`
                });
            }
            if (tx) {
                setTxHash(tx);
            }
        } catch (err: any) {
            console.error("Transaction Error:", err);
            const msg = err?.shortMessage ?? err?.message ?? 'Transaction failed';
            if (msg.includes("internal accounts")) {
                setError("Smart Wallet (EIP-4337) detected. Smart Wallets do not allow 0 ETH transfers + data to EOAs. Please use a standard EOA wallet like MetaMask.");
            } else {
                setError(msg);
            }
        } finally {
            setIsPending(false);
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
