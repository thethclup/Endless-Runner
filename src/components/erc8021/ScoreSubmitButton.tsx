import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useOnchainScore } from '../../hooks/useOnchainScore';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ExternalLink, X } from 'lucide-react';

interface ScoreSubmitButtonProps {
    score: number;
}

export function ScoreSubmitButton({ score }: ScoreSubmitButtonProps) {
    const { isConnected, chainId } = useAccount();
    const { submitScore, isSubmitting, txHash, error } = useOnchainScore();
    const [showModal, setShowModal] = useState(false);

    const handleRecordScore = async () => {
        if (!isConnected) return;
        const hash = await submitScore(score);
        if (hash) {
            setShowModal(true);
        }
    };

    const explorerBase = chainId === 84532 ? 'https://sepolia.basescan.org' : 'https://basescan.org';

    return (
        <>
            <button
                onClick={handleRecordScore}
                disabled={!isConnected || isSubmitting || !!txHash}
                className={`w-full py-4 font-bold rounded-2xl uppercase tracking-widest transition-all cyber-btn relative overflow-hidden group ${
                    !isConnected ? 'glass text-slate-500 cursor-not-allowed' :
                    txHash ? 'bg-green-600/50 text-white cursor-default border-green-500' :
                    'glass hover:bg-white/10 text-white'
                }`}
            >
                <span className="relative z-10">
                    {!isConnected ? 'Wallet Not Connected' : txHash ? 'Secured On-Chain!' : isSubmitting ? 'Securing...' : 'Record Score On-Chain'}
                </span>
                {!txHash && isConnected && !isSubmitting && (
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-pink-500/0 via-pink-500/20 to-pink-500/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                )}
            </button>
            {error && <p className="text-red-400 text-xs text-center mt-2">{error}</p>}

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
                            className="glass p-8 max-w-md w-full relative flex flex-col items-center text-center overflow-hidden border border-pink-500/30"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-magenta-400 to-pink-500 neon-magenta" />
                            
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>

                            <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mb-6">
                                <ShieldCheck className="text-pink-400 w-10 h-10" />
                            </div>

                            <h2 className="text-3xl font-black italic neon-magenta mb-2 uppercase tracking-tight">Score Secured! 🛡️</h2>
                            <p className="text-slate-400 text-sm mb-6">Your run has been permanently recorded on Base Mainnet with active ERC-8021 attribution.</p>
                            
                            <div className="w-full bg-black/40 border border-white/5 rounded-xl p-4 mb-6 space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                    <span className="text-slate-400 uppercase tracking-widest text-xs">Score</span>
                                    <span className="text-xl font-bold font-mono text-white">{score.toLocaleString()}</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Transaction Hash</p>
                                    <p className="text-[11px] font-mono text-pink-300 break-all">{txHash}</p>
                                </div>
                            </div>

                            <a 
                                href={`${explorerBase}/tx/${txHash}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full py-3 bg-white/5 hover:bg-white/10 cyber-btn font-bold tracking-widest text-sm rounded-xl uppercase flex items-center justify-center gap-2 transition-colors neon-magenta"
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
