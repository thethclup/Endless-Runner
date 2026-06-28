import { useState, useCallback } from 'react';
import { GameState, ScoreData } from './types';
import TitleScreen from './components/TitleScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import { useAccount, useSwitchChain, useSendTransaction, useSendCalls, useConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { getCallsStatus } from 'wagmi/actions';
import { Sun } from 'lucide-react';
import { Attribution } from 'ox/erc8021';
import { BUILDER_CODE } from './lib/erc8021/constants';

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
});

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [lastScore, setLastScore] = useState<ScoreData>({ distance: 0, score: 0, combo: 0 });
  const { isConnected, address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendCallsAsync } = useSendCalls();
  const { sendTransactionAsync } = useSendTransaction();
  const config = useConfig();
  const [isPending, setIsPending] = useState(false);
  
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('runner_high_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const sendGMTransaction = async () => {
    if (!isConnected || !address) return;
    setIsPending(true);
    try {
        if (chainId !== base.id) await switchChainAsync({ chainId: base.id });
        const to = '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3' as `0x${string}`;
        const value = 0n; // 0 ETH self-transfer
        const data = '0x474d'; // "GM" in hex
        let hash: string = '';
        try {
            const result = await sendCallsAsync({
                calls: [{ to, value, data }],
                capabilities: {
                  dataSuffix: {
                    value: DATA_SUFFIX,
                    optional: true,
                  },
                },
            });
            
            while (true) {
                const callsStatus = await getCallsStatus(config, { id: result.id });
                if (callsStatus.status === 'success') {
                    hash = callsStatus.receipts?.[0]?.transactionHash || result.id;
                    break;
                } else if (callsStatus.status === 'failure') {
                    throw new Error('Transaction failed');
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (err) {
            hash = await sendTransactionAsync({
                to,
                value,
                data: data as `0x${string}`,
                dataSuffix: DATA_SUFFIX,
            } as any);
        }
        console.log("GM Sent Onchain:", hash);
    } catch (err: any) {
        console.error("GM Failed:", err);
    } finally {
        setIsPending(false);
    }
  };

  const handleStartGame = useCallback(() => {
    setGameState('PLAYING');
  }, []);

  const handleGameOver = useCallback((scoreData: ScoreData) => {
    setLastScore(scoreData);
    if (scoreData.score > highScore) {
      setHighScore(Math.floor(scoreData.score));
      localStorage.setItem('runner_high_score', Math.floor(scoreData.score).toString());
    }
    setGameState('GAMEOVER');
  }, [highScore]);

  const handleGoToTitle = useCallback(() => {
    setGameState('TITLE');
  }, []);

  return (
    <div className="w-full h-full min-h-[100dvh] bg-mesh text-white overflow-hidden relative font-sans touch-none selection:bg-transparent">
      {gameState === 'TITLE' && <TitleScreen onStart={handleStartGame} highScore={highScore} />}
      {gameState === 'PLAYING' && <GameScreen onGameOver={handleGameOver} />}
      {gameState === 'GAMEOVER' && <GameOverScreen score={lastScore} highScore={highScore} onRestart={handleStartGame} onQuit={handleGoToTitle} />}
      
      {/* Visual artifacts / scanlines overlay for cyberpunk feel */}
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay"></div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#E8A020]/10 to-transparent mix-blend-screen"></div>

      {isConnected && (
        <div className="absolute top-4 right-4 z-50">
          <button
              onClick={sendGMTransaction}
              disabled={isPending || !isConnected}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold disabled:opacity-50"
          >
              <Sun size={14} />
              {isPending ? 'Sending...' : 'Say GM'}
          </button>
        </div>
      )}
    </div>
  );
}
