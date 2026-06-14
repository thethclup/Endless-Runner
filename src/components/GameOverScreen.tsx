import { useState } from 'react';
import { motion } from 'motion/react';
import { ScoreData } from '../types';
import { ScoreSubmitButton } from './erc8021/ScoreSubmitButton';

interface GameOverScreenProps {
  score: ScoreData;
  highScore: number;
  onRestart: () => void;
  onQuit: () => void;
}

export default function GameOverScreen({ score, highScore, onRestart, onQuit }: GameOverScreenProps) {
  const isNewHighScore = score.score > highScore && score.score > 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl p-6 z-50">
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        <h2 className={`text-4xl font-black italic mb-2 ${isNewHighScore ? 'neon-magenta' : 'text-red-500'}`}>
          {isNewHighScore ? 'NEW HIGH SCORE!' : 'RUN ENDED'}
        </h2>

        <div className="w-full glass p-6 mb-8 space-y-4">
          <div className="flex justify-between items-end border-b border-white/10 pb-2">
            <span className="text-slate-400 font-mono text-sm">DISTANCE</span>
            <span className="text-2xl font-bold neon-cyan font-mono">{Math.floor(score.distance)}m</span>
          </div>
          <div className="flex justify-between items-end border-b border-white/10 pb-2">
            <span className="text-slate-400 font-mono text-sm">MAX COMBO</span>
            <span className="text-xl font-bold text-yellow-400 font-mono">x{score.combo.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-end pt-2">
            <span className="text-slate-400 font-mono text-sm">FINAL SCORE</span>
            <span className="text-4xl font-bold text-white font-mono">{Math.floor(score.score).toLocaleString()}</span>
          </div>
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={onRestart}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-2xl uppercase tracking-widest shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all"
          >
            Run Again
          </button>
          
          <ScoreSubmitButton scoreData={score} />

          <button
            onClick={onQuit}
            className="w-full py-4 glass hover:bg-white/10 cyber-btn text-slate-400 hover:text-white font-bold rounded-2xl uppercase tracking-widest transition-colors"
          >
            Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}
