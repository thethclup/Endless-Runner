import React from 'react';
import { useERC8021BatchTransaction } from '../../lib/erc8021/hooks/useERC8021BatchTransaction';

export function ERC8021TestRunner() {
    const { sendBatch } = useERC8021BatchTransaction();

    const handleBatch = async () => {
        const hash = await sendBatch([
            { to: '0x123', value: '0', data: '0x' },
            { to: '0x456', value: '0', data: '0x' }
        ]);
        console.log("Delegated Batch with suffix:", hash);
    };

    return (
        <div className="p-4 border border-pink-500/30 rounded-xl bg-black/40 backdrop-blur-sm space-y-4 mt-4">
            <h3 className="text-xl font-bold uppercase tracking-widest text-pink-400">Batch Suffixing</h3>
            <p className="text-xs text-slate-400">Wraps batched transactions in a unified calldata payload.</p>
            <button 
                onClick={handleBatch}
                className="px-6 py-2 bg-pink-900/50 hover:bg-pink-800/50 border border-pink-500/30 rounded font-bold transition-all text-sm uppercase tracking-widest"
            >
                Test Batch TX
            </button>
        </div>
    );
}
