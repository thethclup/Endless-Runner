import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useOnchainScore } from '../../hooks/useOnchainScore';
import { base, baseSepolia } from 'wagmi/chains';
import { baseVibenet } from '../../lib/denim/constants';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ExternalLink, X, Zap } from 'lucide-react';
import { ScoreData } from '../../types';
import { BUILDER_CODE } from '../../lib/erc8021/constants';

interface ScoreSubmitButtonProps {
    scoreData: ScoreData;
}

export function ScoreSubmitButton({ scoreData }: ScoreSubmitButtonProps) {
    const { isConnected, chainId } = useAccount();
    const { submitScore, isSubmitting, txHash, confirmationTimeMs, error } = useOnchainScore();
    const [showModal, setShowModal] = useState(false);

    const handleRecordScore = async () => {
        if (!isConnected) return;
        const hash = await submitScore(scoreData);
        if (hash) {
            setShowModal(true);
        }
    };

    const getExplorerUrl = (hash: string) => {
        if (chainId === baseVibenet.id) return `https://explorer.vibes.base.org/tx/${hash}`;
        if (chainId === baseSepolia.id) return `https://sepolia.basescan.org/tx/${hash}`;
        return `https://basescan.org/tx/${hash}`;
    };

    const getNetworkLabel = () => {
        if (chainId === baseVibenet.id) return 'Base Vibenet (Denim 200ms)';
        if (chainId === baseSepolia.id) return 'Base Sepolia (Denim Live)';
        return 'Base Mainnet';
    };

    return (
        <>
            <button
                onClick={handleRecordScore}
                disabled={!isConnected || isSubmitting || !!txHash}
                className={`w-full py-4 font-bold rounded-2xl uppercase tracking-widest transition-all cyber-btn relative overflow-hidden group ${
                    !isConnected ? 'glass text-slate-500 cursor-not-allowed' :
                    txHash ? 'bg-emerald-600/50 text-white cursor-default border-emerald-500' :
                    'glass hover:bg-white/10 text-white'
                }`}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {!isConnected ? 'Wallet Not Connected' : 
                     txHash ? '⚡ Secured on Denim Native Block!' : 
                     isSubmitting ? 'Securing in 200ms...' : 
                     'Record Score Onchain (Denim)'}
                </span>
                {!txHash && isConnected && !isSubmitting && (
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                )}
            </button>
            {error && <p className="text-red-400 text-xs text-center mt-2">{error}</p>}

            <AnimatePresence>
                {showModal && txHash && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass p-8 max-w-md w-full relative flex flex-col items-center text-center overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.3)]"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                            
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>

                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-5 border border-cyan-500/40">
                                <Zap className="text-cyan-400 w-9 h-9 animate-pulse" />
                            </div>

                            <h2 className="text-2xl font-black italic text-white mb-1 uppercase tracking-tight">
                                Score Confirmed in 200ms!
                            </h2>
                            <p className="text-slate-400 text-xs mb-5">
                                Included in a canonical Denim native block on <strong className="text-white">{getNetworkLabel()}</strong>.
                            </p>
                            
                            <div className="w-full bg-black/50 border border-white/10 rounded-xl p-4 mb-5 space-y-3 font-mono text-xs">
                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="text-slate-400 uppercase tracking-widest text-[10px]">Score</span>
                                    <span className="text-lg font-bold text-white">{Math.floor(scoreData.score).toLocaleString()}</span>
                                </div>
                                {confirmationTimeMs && (
                                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                        <span className="text-slate-400 uppercase tracking-widest text-[10px]">Confirmation Latency</span>
                                        <span className="text-xs font-bold text-emerald-400">~{confirmationTimeMs} ms</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="text-slate-400 uppercase tracking-widest text-[10px]">Attribution (ERC-8021)</span>
                                    <span className="text-xs font-bold text-[#E8A020]">{BUILDER_CODE}</span>
                                </div>
                                <div className="text-left pt-1">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Transaction Hash</p>
                                    <p className="text-[11px] text-cyan-300 break-all">{txHash}</p>
                                </div>
                            </div>

                            <a 
                                href={getExplorerUrl(txHash)} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 cyber-btn font-bold tracking-widest text-xs rounded-xl uppercase flex items-center justify-center gap-2 transition-colors font-mono"
                            >
                                View Canonical Block <ExternalLink size={15} />
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
