import { useState, useCallback } from 'react';
import { GameState, ScoreData } from './types';
import TitleScreen from './components/TitleScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import { DenimHeaderBar } from './components/DenimHeaderBar';
import { useAccount, useSwitchChain, useSendTransaction, useSendCalls, useConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { getCallsStatus } from 'wagmi/actions';
import { Attribution } from 'ox/erc8021';
import { BUILDER_CODE } from './lib/erc8021/constants';
import { DENIM_BLOCK_TIME_MS, baseVibenet } from './lib/denim/constants';

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
      const allowedChains = [base.id, 84532, baseVibenet.id];
      if (!chainId || !allowedChains.includes(chainId)) {
        await switchChainAsync({ chainId: base.id });
      }

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
        
        // Fast 200ms canonical block confirmation loop
        while (true) {
          const callsStatus = await getCallsStatus(config, { id: result.id });
          if (callsStatus.status === 'success') {
            hash = callsStatus.receipts?.[0]?.transactionHash || result.id;
            break;
          } else if (callsStatus.status === 'failure') {
            throw new Error('Transaction failed onchain');
          }
          await new Promise(resolve => setTimeout(resolve, DENIM_BLOCK_TIME_MS));
        }
      } catch (err) {
        hash = await sendTransactionAsync({
          to,
          value,
          data: data as `0x${string}`,
          dataSuffix: DATA_SUFFIX,
        } as any);
      }
      console.log("GM Sent Onchain (Denim):", hash);
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
      {/* Top Denim Bar with 200ms heartbeat pulse */}
      <DenimHeaderBar onSendGM={sendGMTransaction} isGMSending={isPending} />

      {gameState === 'TITLE' && <TitleScreen onStart={handleStartGame} highScore={highScore} />}
      {gameState === 'PLAYING' && <GameScreen onGameOver={handleGameOver} />}
      {gameState === 'GAMEOVER' && <GameOverScreen score={lastScore} highScore={highScore} onRestart={handleStartGame} onQuit={handleGoToTitle} />}
      
      {/* Visual artifacts / scanlines overlay for cyberpunk feel */}
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay"></div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#E8A020]/10 to-transparent mix-blend-screen"></div>
    </div>
  );
}
