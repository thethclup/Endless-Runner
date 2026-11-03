import React, { useState, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { baseVibenet, DENIM_BLOCK_TIME_MS } from '../lib/denim/constants';
import { Zap, Sun, Shield, Activity } from 'lucide-react';
import { DenimStatusModal } from './DenimStatusModal';

interface DenimHeaderBarProps {
  onSendGM: () => Promise<void>;
  isGMSending: boolean;
}

export function DenimHeaderBar({ onSendGM, isGMSending }: DenimHeaderBarProps) {
  const { isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [modalOpen, setModalOpen] = useState(false);
  const [blockPulse, setBlockPulse] = useState(false);
  const [blockCount, setBlockCount] = useState(1);

  // 200ms Denim block pulse simulation for UI heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      setBlockPulse(prev => !prev);
      setBlockCount(c => c + 1);
    }, DENIM_BLOCK_TIME_MS);
    return () => clearInterval(timer);
  }, []);

  const getNetworkName = () => {
    if (chainId === baseVibenet.id) return 'Vibenet (200ms)';
    if (chainId === baseSepolia.id) return 'Base Sepolia (Denim)';
    if (chainId === base.id) return 'Base Mainnet';
    return 'Base Network';
  };

  return (
    <>
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-auto">
        {/* Left: Denim status badge & heartbeat */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-cyan-500/30 text-white backdrop-blur-md transition-all shadow-lg hover:border-cyan-400 group"
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-100 ${
                  blockPulse ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_#22d3ee]' : 'bg-cyan-600 scale-95'
                }`}
              />
            </div>
            <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300 uppercase flex items-center gap-1.5">
              <Zap size={13} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
              Denim 200ms
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
              5 blocks/s
            </span>
          </button>
        </div>

        {/* Right: Network indicator & GM action button */}
        <div className="flex items-center gap-2">
          {isConnected && (
            <div className="hidden sm:flex items-center gap-2">
              <select
                aria-label="Select Base Network"
                value={chainId || base.id}
                onChange={async (e) => {
                  try {
                    await switchChainAsync({ chainId: Number(e.target.value) });
                  } catch (err) {
                    console.error('Network switch failed', err);
                  }
                }}
                className="bg-black/60 border border-white/10 text-slate-300 text-xs font-mono rounded-xl px-2.5 py-1.5 backdrop-blur-md focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value={base.id}>Base Mainnet</option>
                <option value={baseSepolia.id}>Base Sepolia (Denim Live)</option>
                <option value={baseVibenet.id}>Base Vibenet (200ms Preview)</option>
              </select>
            </div>
          )}

          {isConnected && (
            <button
              onClick={onSendGM}
              disabled={isGMSending}
              className="px-3.5 py-1.5 rounded-xl bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-1.5 font-mono text-xs font-bold disabled:opacity-50 shadow-md backdrop-blur-md"
            >
              <Sun size={14} className={isGMSending ? 'animate-spin' : ''} />
              {isGMSending ? 'Landing in 200ms...' : 'Say GM'}
            </button>
          )}
        </div>
      </div>

      <DenimStatusModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
