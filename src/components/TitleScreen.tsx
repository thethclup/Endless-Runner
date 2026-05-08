import { motion } from 'motion/react';
import { useWeb3 } from '../hooks/useWeb3';

interface TitleScreenProps {
  onStart: () => void;
  highScore: number;
}

export default function TitleScreen({ onStart, highScore }: TitleScreenProps) {
  const { address, isConnected, login, logout, sayGM } = useWeb3();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
      {/* Background neon elements */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="w-[120%] h-[120%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#f472b640_100%)] animate-[spin_10s_linear_infinite] blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-lg w-full">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 relative"
        >
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-2 leading-none">
            ENDLESS
            <br />
            <span className="neon-cyan">RUNNER</span> DASH
          </h1>
          <p className="mt-4 text-slate-400 uppercase tracking-[0.4em] text-xs md:text-sm">Base Mainnet Edition</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full max-w-xs py-5 mb-6 rounded-2xl font-black text-xl uppercase tracking-widest bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all"
        >
          START DASH
        </motion.button>

        <div className="w-full max-w-xs space-y-4 font-mono text-sm">
          <div className="glass p-4 text-center">
            <p className="text-[10px] uppercase text-slate-400 mb-1">HIGH SCORE</p>
            <p className="text-2xl font-bold neon-cyan">{highScore.toLocaleString()}</p>
          </div>

          <div className="glass p-4 flex flex-col items-center gap-3">
            {!isConnected ? (
              <button onClick={login} className="w-full py-3 glass hover:bg-white/10 cyber-btn transition-colors text-sm font-bold tracking-widest uppercase">
                Connect Wallet (Base)
              </button>
            ) : (
                <div className="w-full text-center space-y-3">
                   <p className="text-xs text-slate-400 truncate w-full px-2">
                       {address?.substring(0,6)}...{address?.substring(address.length - 4)}
                   </p>
                   <div className="flex gap-2">
                     <button onClick={sayGM} className="flex-1 py-3 glass hover:bg-white/10 cyber-btn transition-colors text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                        Say GM
                     </button>
                     <button onClick={logout} className="flex-1 py-3 glass hover:bg-white/10 cyber-btn transition-colors text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                        Disconnect
                     </button>
                   </div>
                </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-slate-500 font-mono text-[10px] tracking-widest pointer-events-none flex flex-col items-center gap-1">
        <span>PROT: ERC-8021</span>
        <span>ATTRIBUTION: [ATTRIBUTION_CODE] | BUILDER: bc_1aw46v36</span>
      </div>
    </div>
  );
}
