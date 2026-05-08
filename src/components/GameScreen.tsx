import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ScoreData } from '../types';
import { CanvasEngine } from '../lib/GameEngine';

interface GameScreenProps {
  onGameOver: (score: ScoreData) => void;
}

export default function GameScreen({ onGameOver }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CanvasEngine | null>(null);
  
  const [hud, setHud] = useState({ distance: 0, score: 0, combo: 1 });

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Game Engine
    engineRef.current = new CanvasEngine(canvasRef.current, {
        onScoreUpdate: (data) => setHud(data),
        onGameOver: (finalScore) => {
             onGameOver(finalScore);
        }
    });
    
    engineRef.current.start();

    // Prevent default touch behaviors (like scrolling) on the canvas
    const preventDefault = (e: TouchEvent) => e.preventDefault();
    canvasRef.current.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
      if (canvasRef.current) {
          canvasRef.current.removeEventListener('touchmove', preventDefault);
      }
    };
  }, [onGameOver]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    engineRef.current?.handleInput('start', e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    engineRef.current?.handleInput('move', e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    engineRef.current?.handleInput('end', 0);
  };

  return (
    <div 
        className="absolute inset-0 bg-transparent"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        // Mouse fallback for testing
        onMouseDown={(e) => engineRef.current?.handleInput('start', e.clientY)}
        onMouseMove={(e) => {
            if (e.buttons > 0) engineRef.current?.handleInput('move', e.clientY);
        }}
        onMouseUp={() => engineRef.current?.handleInput('end', 0)}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block touch-none absolute inset-0 -z-10 mix-blend-screen opacity-80"
      />
      
      {/* HUD Layer */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
        
        <div className="glass px-4 py-2 flex flex-col gap-1">
            <div className="text-3xl font-black text-white italic font-mono tracking-tighter">
                {Math.floor(hud.score).toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                {Math.floor(hud.distance)}m
            </div>
        </div>

        <div className="flex flex-col items-end transform origin-top-right">
            <div className={`text-2xl font-black italic transition-all duration-100 px-4 py-2 rounded-2xl ${hud.combo > 1 ? 'glass neon-magenta scale-110' : 'text-slate-500'}`}>
                {hud.combo > 1 ? `x${hud.combo.toFixed(1)}` : 'COMBO'}
            </div>
        </div>

      </div>
    </div>
  );
}
