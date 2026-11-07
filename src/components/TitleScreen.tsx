import { useState } from 'react';
import { motion } from 'motion/react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { BUILDER_CODE } from '../lib/erc8021/constants';
import { base, baseSepolia } from 'wagmi/chains';
import { baseVibenet } from '../lib/denim/constants';
import { Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { DenimStatusModal } from './DenimStatusModal';

interface TitleScreenProps {
  onStart: () => void;
  highScore: number;
}

export default function TitleScreen({ onStart, highScore }: TitleScreenProps) {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const [denimModalOpen, setDenimModalOpen] = useState(false);

  const isMainnet = chainId === base.id;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
      {/* Background neon elements */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="w-[120%] h-[120%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d440_100%)] animate-[spin_10s_linear_infinite] blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-lg w-full">
        {/* Denim Mainnet Live Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <button
            onClick={() => setDenimModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-500/25 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
            <Zap size={13} className="text-emerald-400" />
            <span>BASE MAINNET DENIM: 200ms BLOCKS LIVE</span>
          </button>
        </motion.div>

        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 relative"
        >
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-2 leading-none">
            WARP
            <br />
            <span className="text-[#E8A020] [text-shadow:0_0_20px_#E8A020]">JUMPER</span>
          </h1>
          <p className="mt-3 text-emerald-400 font-mono font-bold uppercase tracking-[0.25em] text-xs md:text-sm flex items-center justify-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            Base Mainnet Denim Edition
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full max-w-xs py-5 mb-6 rounded-2xl font-black text-xl uppercase tracking-widest bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-[0_0_40px_rgba(232,160,32,0.4)] transition-all"
        >
          START WARP
        </motion.button>

        <div className="w-full max-w-xs space-y-4 font-mono text-sm">
          <div className="glass p-4 text-center">
            <p className="text-[10px] uppercase text-slate-400 mb-1">HIGH SCORE</p>
            <p className="text-2xl font-bold neon-cyan">{highScore.toLocaleString()}</p>
          </div>

          <div className="glass p-4 flex flex-col items-center gap-3">
            {!isConnected ? (
              <button onClick={() => {
                const injectedConnector = connectors.find(c => c.type === 'injected') ?? connectors[0];
                connect({ connector: injectedConnector });
              }} className="w-full py-3 glass hover:bg-white/10 cyber-btn transition-colors text-sm font-bold tracking-widest uppercase">
                Connect Wallet (Base Mainnet)
              </button>
            ) : (
              <div className="w-full text-center space-y-3">
                <div className="flex items-center justify-between px-2 text-xs">
                  <span className="text-slate-400 truncate">
                    {address?.substring(0,6)}...{address?.substring(address.length - 4)}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isMainnet ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {chainId === base.id ? 'Mainnet (Denim)' : chainId === baseSepolia.id ? 'Sepolia (Denim)' : 'Vibenet (200ms)'}
                  </span>
                </div>
                <div className="flex gap-2 justify-center">
                  {!isMainnet && (
                    <button
                      onClick={() => switchChainAsync({ chainId: base.id })}
                      className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-widest uppercase"
                    >
                      To Mainnet
                    </button>
                  )}
                  <button onClick={() => disconnect()} className="flex-1 py-2 glass hover:bg-white/10 cyber-btn transition-colors text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-300">
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-slate-500 font-mono text-[10px] tracking-widest pointer-events-none flex flex-col items-center gap-1">
        <span className="text-emerald-400/90 font-bold">BASE MAINNET DENIM 200ms NATIVE BLOCKS · FLASHBLOCKS RETIRED</span>
        <span>ATTRIBUTION: {BUILDER_CODE} · CANONICAL 200ms CADENCE</span>
      </div>

      <DenimStatusModal isOpen={denimModalOpen} onClose={() => setDenimModalOpen(false)} />
    </div>
  );
}
