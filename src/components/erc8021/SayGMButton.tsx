import React, { useState } from 'react';
import { useAccount, useSendTransaction, useSendCalls } from 'wagmi';
import { base } from 'wagmi/chains';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ExternalLink, X, Sun } from 'lucide-react';

export function SayGMButton() {
    const { address, isConnected, chainId, connector } = useAccount();
    const { sendTransactionAsync } = useSendTransaction();
    const { sendCallsAsync } = useSendCalls();
    
    const [isPending, setIsPending] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSayGM = async () => {
        if (!isConnected || !address) return;
        setError(null);
        try {
            setIsPending(true);
            let hash;
            const isCoinbaseWallet = connector?.id === 'coinbaseWalletSDK';
            
            if (isCoinbaseWallet) {
                hash = await sendCallsAsync({
                    calls: [{
                        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
                        value: 0n,
                        data: '0x474d'
                    }]
                });
            } else {
                hash = await sendTransactionAsync({
                    to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
                    value: 0n, 
                    data: '0x474d' 
                });
            }
            
            setTxHash(hash);
            setShowModal(true);
        } catch (err: any) {
            console.error("GM Failed:", err);
            const msg = err?.shortMessage ?? err?.message ?? 'Transaction failed';
            setError(msg);
        } finally {
            setIsPending(false);
        }
    };

    const explorerBase = chainId === 84532 ? 'https://sepolia.basescan.org' : 'https://basescan.org';

    return (
        <>
            <button
                onClick={handleSayGM}
                disabled={isPending || !isConnected}
                className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold disabled:opacity-50"
            >
                <Sun size={14} />
                {isPending ? 'SENDING...' : 'SAY GM'}
            </button>
            {error && <p className="text-red-400 text-[10px] mt-1 text-center max-w-[150px] leading-tight truncate" title={error}>{error}</p>}

            <AnimatePresence>
                {showModal && txHash && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass p-8 max-w-md w-full relative flex flex-col items-center text-center overflow-hidden border border-cyan-500/30"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                            
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>

                            <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6">
                                <CheckCircle2 className="text-cyan-400 w-10 h-10" />
                            </div>

                            <h2 className="text-3xl font-black italic neon-cyan mb-2 uppercase tracking-tight">GM Sent!</h2>
                            <p className="text-slate-400 text-sm mb-6">Your on-chain greeting has been broadcasted.</p>
                            
                            <div className="w-full bg-black/40 border border-white/5 rounded-xl p-4 mb-6">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Transaction</p>
                                <p className="text-xs font-mono text-cyan-300 break-all">{txHash}</p>
                            </div>

                            <a 
                                href={`${explorerBase}/tx/${txHash}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full py-3 bg-white/5 hover:bg-white/10 cyber-btn font-bold tracking-widest text-sm rounded-xl uppercase flex items-center justify-center gap-2 transition-colors"
                            >
                                View on Basescan <ExternalLink size={16} />
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
