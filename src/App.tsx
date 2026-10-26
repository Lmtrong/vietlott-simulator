import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Flame, ShieldAlert, Sparkles, Zap } from 'lucide-react';
import { DrawRecord, DrawResultData, DrawState, GameType } from './types';
import {
  formatTimestamp,
  GAME_CONFIGS,
  generateDrawResult,
  generateSessionCode,
} from './utils/lottery';
import { Header } from './components/Header';
import { LotteryMachine } from './components/LotteryMachine';
import { DrawResult } from './components/DrawResult';
import { DrawControls } from './components/DrawControls';
import { DrawHistory } from './components/DrawHistory';

export const App: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('MEGA_645');
  const [drawState, setDrawState] = useState<DrawState>('IDLE');
  const [resultData, setResultData] = useState<DrawResultData | null>(null);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [sessionCode, setSessionCode] = useState<string>(() =>
    generateSessionCode('MEGA_645')
  );
  const [lastDrawTime, setLastDrawTime] = useState<string | null>(null);
  const [history, setHistory] = useState<DrawRecord[]>([]);

  const sessionCounterRef = useRef<number>(0);
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const isBusy = drawState === 'SPINNING' || drawState === 'DRAWING';
  const currentConfig = GAME_CONFIGS[activeGame];
  const totalToReveal = currentConfig.hasPowerBall ? 7 : 6;

  // Switch between Mega 6/45 and Power 6/55 when not actively drawing
  const handleSelectGame = (game: GameType) => {
    if (isBusy || game === activeGame) return;
    clearAllTimers();
    setActiveGame(game);
    setDrawState('IDLE');
    setResultData(null);
    setRevealedCount(0);
    setSessionCode(generateSessionCode(game));
  };

  // Start or Replay a lottery draw (~5.8s for Mega 6/45, ~6.7s for Power 6/55)
  const handleStartDraw = () => {
    if (isBusy) return;
    clearAllTimers();

    const newSessionCode =
      drawState === 'IDLE' ? sessionCode : generateSessionCode(activeGame);
    setSessionCode(newSessionCode);

    const generated = generateDrawResult(activeGame);
    setResultData(generated);
    setRevealedCount(0);
    setDrawState('SPINNING');

    const schedule = (fn: () => void, delayMs: number) => {
      const id = window.setTimeout(fn, delayMs);
      timersRef.current.push(id);
    };

    // Phase 1: High-speed mixing inside the sphere (1.45s)
    const spinDuration = 1450;
    const ballInterval = 720;

    // Phase 2: Reveal each of the 6 main balls sequentially
    for (let i = 1; i <= 6; i++) {
      schedule(() => {
        setDrawState('DRAWING');
        setRevealedCount(i);
      }, spinDuration + (i - 1) * ballInterval);
    }

    const sixBallsDoneTime = spinDuration + 5 * ballInterval; // ~5050ms

    if (activeGame === 'POWER_655') {
      // Dramatic build-up before extracting the 7th Power Ball
      const powerRevealTime = sixBallsDoneTime + 900; // ~5950ms
      schedule(() => {
        setRevealedCount(7);
      }, powerRevealTime);

      // Phase 3: Finish draw, sort main numbers ascending, and record history (~6750ms)
      schedule(() => {
        const timestamp = formatTimestamp(new Date());
        sessionCounterRef.current += 1;
        const newIndex = sessionCounterRef.current;

        setDrawState('FINISHED');
        setLastDrawTime(timestamp);
        setHistory((prev) => [
          {
            id: `${newSessionCode}-${Date.now()}`,
            sessionIndex: newIndex,
            sessionCode: newSessionCode,
            gameType: activeGame,
            mainNumbers: generated.mainNumbers,
            powerNumber: generated.powerNumber,
            timestamp,
          },
          ...prev,
        ]);
      }, powerRevealTime + 800);
    } else {
      // Phase 3 for Mega 6/45: Finish draw, sort main numbers ascending, and record history (~5850ms)
      schedule(() => {
        const timestamp = formatTimestamp(new Date());
        sessionCounterRef.current += 1;
        const newIndex = sessionCounterRef.current;

        setDrawState('FINISHED');
        setLastDrawTime(timestamp);
        setHistory((prev) => [
          {
            id: `${newSessionCode}-${Date.now()}`,
            sessionIndex: newIndex,
            sessionCode: newSessionCode,
            gameType: activeGame,
            mainNumbers: generated.mainNumbers,
            timestamp,
          },
          ...prev,
        ]);
      }, sixBallsDoneTime + 800);
    }
  };

  // Reset stage back to initial IDLE state
  const handleReset = () => {
    if (isBusy) return;
    clearAllTimers();
    setDrawState('IDLE');
    setResultData(null);
    setRevealedCount(0);
    setSessionCode(generateSessionCode(activeGame));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Determine the latest revealed ball to preview in the top extractor tube during DRAWING
  const latestRevealedBall = React.useMemo(() => {
    if (!resultData || revealedCount === 0) return null;
    if (revealedCount <= 6) {
      return {
        number: resultData.drawnOrder[revealedCount - 1],
        isPower: false,
      };
    }
    if (revealedCount === 7 && resultData.powerNumber !== undefined) {
      return {
        number: resultData.powerNumber,
        isPower: true,
      };
    }
    return null;
  }, [resultData, revealedCount]);

  return (
    <div
      className={`app-shell theme-${
        activeGame === 'MEGA_645' ? 'mega' : 'power'
      } stage-state-${drawState.toLowerCase()}`}
    >
      {/* Ambient Studio Lighting Backdrop */}
      <div className="studio-ambient-bg" aria-hidden="true">
        <div className="ambient-orb orb-primary" />
        <div className="ambient-orb orb-secondary" />
        <div className="studio-grid-overlay" />
      </div>

      {/* A. Header & Game Selector */}
      <Header
        activeGame={activeGame}
        onSelectGame={handleSelectGame}
        disabled={isBusy}
      />

      <main className="studio-main">
        {/* B. Game Introduction Banner */}
        <section className="game-hero-banner" aria-label="Giới thiệu chương trình">
          <div className="hero-badge-row">
            <span className="hero-program-pill">
              {activeGame === 'MEGA_645' ? (
                <Flame size={14} />
              ) : (
                <Zap size={14} />
              )}
              {currentConfig.badgeText}
            </span>
            <span className="hero-studio-tag">
              <Sparkles size={13} /> TRƯỜNG QUAY MÔ PHỎNG TRỰC TIẾP
            </span>
          </div>

          <h1 className="hero-game-title">{currentConfig.name}</h1>
          <p className="hero-game-description">{currentConfig.description}</p>
        </section>

        {/* C. Centerpiece Lottery Machine Stage */}
        <section className="stage-centerpiece" aria-label="Sân khấu lồng cầu quay số">
          <LotteryMachine
            gameType={activeGame}
            drawState={drawState}
            revealedCount={revealedCount}
            totalToReveal={totalToReveal}
            latestRevealedBall={latestRevealedBall}
          />
        </section>

        {/* D. Draw Result Display */}
        <DrawResult
          gameType={activeGame}
          drawState={drawState}
          resultData={resultData}
          revealedCount={revealedCount}
        />

        {/* E & F. Draw Controls & Session Info */}
        <DrawControls
          gameType={activeGame}
          drawState={drawState}
          sessionCode={sessionCode}
          lastDrawTime={lastDrawTime}
          onStartDraw={handleStartDraw}
          onReset={handleReset}
        />

        {/* G. Draw History */}
        <DrawHistory
          history={history}
          onClearHistory={handleClearHistory}
          disabled={isBusy}
        />
      </main>

      <footer className="studio-footer">
        <div className="footer-disclaimer">
          <ShieldAlert size={16} className="disclaimer-icon" />
          <p>
            <strong>Lưu ý:</strong> Website này là trình mô phỏng quay số ngẫu nhiên độc lập ở phía frontend phục vụ mục đích trải nghiệm giao diện. Kết quả hoàn toàn ngẫu nhiên, không sử dụng dữ liệu thật và không phải là kết quả quay thưởng chính thức của Vietlott.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
