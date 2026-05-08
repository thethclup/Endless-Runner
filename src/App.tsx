import { useState, useEffect, useRef } from 'react';
import { GameState, ScoreData } from './types';
import TitleScreen from './components/TitleScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [lastScore, setLastScore] = useState<ScoreData>({ distance: 0, score: 0, combo: 0 });
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('runner_high_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleStartGame = () => {
    setGameState('PLAYING');
  };

  const handleGameOver = (scoreData: ScoreData) => {
    setLastScore(scoreData);
    if (scoreData.score > highScore) {
      setHighScore(Math.floor(scoreData.score));
      localStorage.setItem('runner_high_score', Math.floor(scoreData.score).toString());
    }
    setGameState('GAMEOVER');
  };

  const handleGoToTitle = () => {
    setGameState('TITLE');
  };

  return (
    <div className="w-full h-full min-h-[100dvh] bg-mesh text-white overflow-hidden relative font-sans touch-none selection:bg-transparent">
      {gameState === 'TITLE' && <TitleScreen onStart={handleStartGame} highScore={highScore} />}
      {gameState === 'PLAYING' && <GameScreen onGameOver={handleGameOver} />}
      {gameState === 'GAMEOVER' && <GameOverScreen score={lastScore} highScore={highScore} onRestart={handleStartGame} onQuit={handleGoToTitle} />}
      
      {/* Visual artifacts / scanlines overlay for cyberpunk feel */}
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay"></div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-pink-900/20 mix-blend-screen"></div>
    </div>
  );
}
