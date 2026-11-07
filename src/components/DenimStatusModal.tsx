import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, CheckCircle2, AlertTriangle, X, Shield, Cpu, Flame, Layers } from 'lucide-react';
import { DENIM_MIGRATION_MAPPINGS, DENIM_NETWORKS, baseVibenet } from '../lib/denim/constants';
import { useAccount, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { BUILDER_CODE } from '../lib/erc8021/constants';

interface DenimStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DenimStatusModal({ isOpen, onClose }: DenimStatusModalProps) {
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [activeTab, setActiveTab] = useState<'status' | 'migration' | 'networks'>('status');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass max-w-2xl w-full border border-cyan-500/30 overflow-hidden relative shadow-[0_0_60px_rgba(6,182,212,0.25)] max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
                <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  BASE MAINNET DENIM <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">200ms CANONICAL</span>
                </h3>
                <p className="text-xs text-slate-400">Mainnet Live Nov 5, 2026 · Flashblocks Retired · Builder Code {BUILDER_CODE}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-black/30 text-xs font-mono font-bold">
            <button
              onClick={() => setActiveTab('status')}
              className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
                activeTab === 'status'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Denim Mainnet Overview
            </button>
            <button
              onClick={() => setActiveTab('migration')}
              className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
                activeTab === 'migration'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Flashblocks Migration Matrix ({DENIM_MIGRATION_MAPPINGS.length})
            </button>
            <button
              onClick={() => setActiveTab('networks')}
              className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
                activeTab === 'networks'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Networks Status
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-sans text-slate-200">
            {activeTab === 'status' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-slate-900/60 border border-emerald-500/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-base">Denim is Live on Base Mainnet</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Denim officially activated on Base Mainnet on November 5, 2026 at 18:00 UTC (and on Base Sepolia on October 21, 2026).
                        Base stopped producing Flashblocks on both networks at activation. Every 200ms tick is a complete, standalone canonical block with its own block number, hash, receipts, and state root.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Block Cadence</span>
                    <span className="text-xl font-bold font-mono text-cyan-400 mt-1">200 ms</span>
                    <span className="text-[11px] text-slate-400 mt-1">5 native blocks / second</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Block Tag Policy</span>
                    <span className="text-xl font-bold font-mono text-emerald-400 mt-1">"latest"</span>
                    <span className="text-[11px] text-slate-400 mt-1">"pending" tag retired</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Attribution Code</span>
                    <span className="text-xl font-bold font-mono text-[#E8A020] mt-1">{BUILDER_CODE}</span>
                    <span className="text-[11px] text-slate-400 mt-1">ERC-8021 calldata suffix</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
                    <Cpu size={14} className="text-cyan-400" />
                    Key Denim Architecture Upgrades
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-5">
                    <li><strong className="text-white">Flashblocks Fully Retired:</strong> Sub-block previews ceased production. Every 200ms is a full canonical block.</li>
                    <li><strong className="text-white">Zero Preconfirmations:</strong> `eth_getTransactionReceipt` returns once included in a canonical 200ms block.</li>
                    <li><strong className="text-white">No "pending" Tags:</strong> State reads, balance checks, and contract calls use canonical state (`latest`).</li>
                    <li><strong className="text-white">Validity Predicates:</strong> `flashblock_index` predicates are rejected; bound transactions by `block_number` only.</li>
                    <li><strong className="text-white">History Horizon:</strong> 256-block `BLOCKHASH` window covers 51.2 seconds of real-world history.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'migration' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 p-3 rounded-lg border border-amber-500/30">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>
                    Denim activated on Base Sepolia (Oct 21, 2026) and on Base Mainnet (Nov 5, 2026).
                    Flashblocks subscriptions and pending state no longer return data.
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/40">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                      <tr>
                        <th className="p-2.5">Integration to Review</th>
                        <th className="p-2.5">Action for Denim</th>
                        <th className="p-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {DENIM_MIGRATION_MAPPINGS.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-2.5 text-red-300 font-mono text-[11px]">{row.legacy}</td>
                          <td className="p-2.5 text-emerald-400 font-bold text-[11px]">{row.denim}</td>
                          <td className="p-2.5 text-slate-400 text-[10px]">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'networks' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Denim 200ms native blocks are active across Base Mainnet and Base Sepolia, as well as Vibenet developer preview.
                </p>

                {Object.entries(DENIM_NETWORKS).map(([key, net]) => {
                  const isActive = chainId === net.id || (!chainId && net.isPrimary);
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        isActive
                          ? 'border-emerald-400 bg-emerald-500/10'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{net.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                            ID: {net.id}
                          </span>
                          {net.isPrimary && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              PRIMARY MAINNET
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                              Connected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{net.status}</p>
                        <p className="text-[11px] font-mono text-slate-500 mt-1">{net.rpc}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={isActive}
                          onClick={async () => {
                            try {
                              await switchChainAsync({ chainId: net.id });
                            } catch (e) {
                              console.error('Failed to switch network:', e);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                        >
                          {isActive ? 'Active' : 'Switch Network'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-black/50 flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Shield size={14} /> Base Mainnet Denim · 200ms Native Blocks
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold uppercase transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
