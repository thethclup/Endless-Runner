import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Radio, CheckCircle2, AlertTriangle, X, Shield, ExternalLink, Cpu } from 'lucide-react';
import { DENIM_MIGRATION_MAPPINGS, DENIM_NETWORKS, DENIM_BLOCK_TIME_MS, baseVibenet } from '../lib/denim/constants';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass max-w-2xl w-full border border-cyan-500/30 overflow-hidden relative shadow-[0_0_50px_rgba(6,182,212,0.2)] max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
                <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  BASE DENIM UPGRADE <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">200ms BLOCKS</span>
                </h3>
                <p className="text-xs text-slate-400">Canonical 5 blocks/sec · Flashblocks Retired · Builder Code bc_1aw46v36</p>
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
          <div className="flex border-b border-white/10 bg-black/20 text-xs font-mono font-bold">
            <button
              onClick={() => setActiveTab('status')}
              className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
                activeTab === 'status'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Denim Overview
            </button>
            <button
              onClick={() => setActiveTab('migration')}
              className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
                activeTab === 'migration'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Flashblocks Migration Matrix
            </button>
            <button
              onClick={() => setActiveTab('networks')}
              className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
                activeTab === 'networks'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Networks (Vibenet / Sepolia / Mainnet)
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-sans text-slate-200">
            {activeTab === 'status' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-900/60 border border-cyan-500/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-base">Migrated to Denim 200ms Native Blocks</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Denim replaces Flashblocks sub-block previews with canonical 200ms blocks (5 blocks per second).
                        Each 200ms tick is a complete, standalone canonical block with its own block number, hash, receipts, and state root.
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
                    Key Denim Architecture Changes
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-5">
                    <li><strong className="text-white">Flashblocks Replaced:</strong> No more intermediate sub-block streams; every 200ms tick produces a canonical block.</li>
                    <li><strong className="text-white">Zero "pending" Tag:</strong> RPC calls (`eth_call`, `eth_getBalance`, `eth_estimateGas`) now target canonical state (`latest`).</li>
                    <li><strong className="text-white">200ms Polling Interval:</strong> Wagmi and confirmation loops updated to 200ms for sub-second user feedback.</li>
                    <li><strong className="text-white">ERC-8021 Calldata Suffix:</strong> Transactions seamlessly carry builder attribution `{BUILDER_CODE}`.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'migration' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 p-3 rounded-lg border border-amber-500/30">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>The "pending" block tag and Flashblocks preconfirmations have no equivalent after Denim.</span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/40">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                      <tr>
                        <th className="p-2.5">Flashblocks (Deprecated)</th>
                        <th className="p-2.5">Action for Denim (Canonical)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {DENIM_MIGRATION_MAPPINGS.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-2.5 text-red-300 line-through opacity-80">{row.legacy}</td>
                          <td className="p-2.5 text-emerald-400 font-bold">{row.denim}</td>
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
                  Select a network to test Denim 200ms blocks. Vibenet is live for developer testing; Base Sepolia activated Denim on Oct 21, 2026.
                </p>

                {Object.entries(DENIM_NETWORKS).map(([key, net]) => {
                  const isActive = chainId === net.id;
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        isActive
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{net.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                            ID: {net.id}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                              Connected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{net.status}</p>
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
                              ? 'bg-cyan-500/20 text-cyan-300 cursor-default'
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
          <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-emerald-400" /> Denim Canonical Specification · 200ms
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
