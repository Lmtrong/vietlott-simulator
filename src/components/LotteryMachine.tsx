import React, { useMemo } from 'react';
import { DrawState, GameType } from '../types';
import { formatBallNumber, getBallColorVariant } from '../utils/lottery';

interface LotteryMachineProps {
  gameType: GameType;
  drawState: DrawState;
  revealedCount: number;
  totalToReveal: number;
  latestRevealedBall?: {
    number: number;
    isPower: boolean;
  } | null;
}

interface ChamberBallData {
  id: number;
  displayNum: number;
  color: string;
  // Resting position at the bottom of the spherical bowl (Idle / Finished)
  idleX: number;
  idleY: number;
  // Chaotic air-jet trajectory waypoints inside the sphere
  tx1: number;
  ty1: number;
  tx2: number;
  ty2: number;
  tx3: number;
  ty3: number;
  tx4: number;
  ty4: number;
  duration: number;
  delay: number;
  depthScale: number;
  zIndex: number;
}

export const LotteryMachine: React.FC<LotteryMachineProps> = ({
  gameType,
  drawState,
  revealedCount,
  totalToReveal,
  latestRevealedBall,
}) => {
  const maxNumber = gameType === 'MEGA_645' ? 45 : 55;

  // Generate 26 rich 3D balls inside the mixing dome with deterministic, realistic trajectories
  const chamberBalls = useMemo<ChamberBallData[]>(() => {
    const count = 26;
    const balls: ChamberBallData[] = [];

    for (let i = 0; i < count; i++) {
      // Spread numbers evenly across 1..maxNumber
      const displayNum = ((i * 2 + 1) % maxNumber) + 1;
      const isGoldAccent = gameType === 'POWER_655' && i % 6 === 0;
      const color = getBallColorVariant(displayNum, isGoldAccent);

      // Arrange idle positions in a natural curved heap at the bottom of the sphere
      const row = Math.floor(i / 7);
      const col = i % 7;
      const spreadX = (col - 3) * 26 + (row % 2 === 0 ? 10 : -10);
      const curveY = Math.abs(col - 3) * 5;
      const idleX = Math.max(-92, Math.min(92, spreadX));
      const idleY = 78 - row * 22 - curveY;

      // Chaotic circular waypoints constrained within sphere radius (~105px)
      const angle1 = ((i * 137.5) % 360) * (Math.PI / 180);
      const angle2 = (((i + 5) * 223.1) % 360) * (Math.PI / 180);
      const angle3 = (((i + 11) * 79.4) % 360) * (Math.PI / 180);
      const angle4 = (((i + 17) * 311.7) % 360) * (Math.PI / 180);

      const r1 = 55 + (i % 5) * 11;
      const r2 = 65 + ((i + 2) % 4) * 12;
      const r3 = 45 + ((i + 3) % 5) * 13;
      const r4 = 60 + ((i + 1) % 4) * 11;

      balls.push({
        id: i,
        displayNum,
        color,
        idleX,
        idleY,
        tx1: Math.round(Math.cos(angle1) * r1),
        ty1: Math.round(Math.sin(angle1) * r1),
        tx2: Math.round(Math.cos(angle2) * r2),
        ty2: Math.round(Math.sin(angle2) * r2),
        tx3: Math.round(Math.cos(angle3) * r3),
        ty3: Math.round(Math.sin(angle3) * r3),
        tx4: Math.round(Math.cos(angle4) * r4),
        ty4: Math.round(Math.sin(angle4) * r4),
        duration: 0.68 + (i % 7) * 0.09,
        delay: (i % 8) * -0.14,
        depthScale: i % 3 === 0 ? 0.88 : i % 3 === 1 ? 0.96 : 1.04,
        zIndex: (i % 3) + 2,
      });
    }
    return balls;
  }, [gameType, maxNumber]);

  const isTurbulent = drawState === 'SPINNING' || drawState === 'DRAWING';

  const getMachineStatusText = () => {
    switch (drawState) {
      case 'IDLE':
        return 'HỆ THỐNG LỒNG CẦU SẴN SÀNG';
      case 'SPINNING':
        return 'ĐANG THỔI KHÍ & TRỘN CẦU TỐC ĐỘ CAO...';
      case 'DRAWING':
        return `ĐANG TRÍCH XUẤT QUẢ CẦU ${revealedCount}/${totalToReveal}...`;
      case 'FINISHED':
        return 'HOÀN TẤT PHIÊN QUAY THƯỞNG';
    }
  };

  return (
    <div className={`lottery-stage-container state-${drawState.toLowerCase()}`}>
      {/* Studio Overhead Spotlights */}
      <div className="stage-spotlight spotlight-left" aria-hidden="true" />
      <div className="stage-spotlight spotlight-center" aria-hidden="true" />
      <div className="stage-spotlight spotlight-right" aria-hidden="true" />

      {/* Background Studio Rings */}
      <div className="stage-halo-rings" aria-hidden="true">
        <div className="halo-ring ring-outer" />
        <div className="halo-ring ring-middle" />
        <div className="halo-ring ring-inner" />
      </div>

      {/* Main 3D Air-Mix Lottery Machine */}
      <div className="lottery-machine-assembly">
        {/* Top Extraction Chute & Valve */}
        <div className="machine-extractor-crown">
          <div className="extractor-cap" />
          <div className="extractor-tube">
            {drawState === 'DRAWING' && latestRevealedBall ? (
              <div
                key={`${latestRevealedBall.number}-${revealedCount}`}
                className={`extracted-ball-preview ball-${getBallColorVariant(
                  latestRevealedBall.number,
                  latestRevealedBall.isPower
                )}`}
              >
                <span className="extracted-ball-num">
                  {formatBallNumber(latestRevealedBall.number)}
                </span>
              </div>
            ) : (
              <div className="extractor-sensor-light" />
            )}
          </div>
          <div className="extractor-collar" />
        </div>

        {/* Spherical Glass Mixing Chamber */}
        <div className="machine-chamber-wrapper">
          {/* Outer Metallic Structural Arcs */}
          <div className="chamber-support-arc arc-left" aria-hidden="true" />
          <div className="chamber-support-arc arc-right" aria-hidden="true" />

          <div className="chamber-glass-sphere">
            {/* Back Glass Ambient Glow */}
            <div className="chamber-back-glow" aria-hidden="true" />

            {/* Air Stream Vortex Effect when Spinning / Drawing */}
            <div
              className={`chamber-air-streams ${isTurbulent ? 'active' : ''}`}
              aria-hidden="true"
            >
              <span className="air-stream s1" />
              <span className="air-stream s2" />
              <span className="air-stream s3" />
              <span className="air-stream s4" />
            </div>

            {/* 3D Lottery Balls inside the Chamber */}
            <div className="chamber-balls-field" aria-hidden="true">
              {chamberBalls.map((ball) => {
                const style = {
                  '--idle-x': `${ball.idleX}px`,
                  '--idle-y': `${ball.idleY}px`,
                  '--tx1': `${ball.tx1}px`,
                  '--ty1': `${ball.ty1}px`,
                  '--tx2': `${ball.tx2}px`,
                  '--ty2': `${ball.ty2}px`,
                  '--tx3': `${ball.tx3}px`,
                  '--ty3': `${ball.ty3}px`,
                  '--tx4': `${ball.tx4}px`,
                  '--ty4': `${ball.ty4}px`,
                  '--spin-dur': `${ball.duration}s`,
                  '--spin-delay': `${ball.delay}s`,
                  '--depth-scale': ball.depthScale,
                  zIndex: ball.zIndex,
                } as React.CSSProperties;

                return (
                  <div
                    key={ball.id}
                    style={style}
                    className={`chamber-ball ball-${ball.color} ${
                      isTurbulent ? 'is-mixing' : 'is-resting'
                    }`}
                  >
                    <span className="chamber-ball-shine" />
                    <span className="chamber-ball-label">
                      {formatBallNumber(ball.displayNum)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Front Curved Glass Specular Highlights */}
            <div className="chamber-front-reflection" aria-hidden="true" />
            <div className="chamber-rim-highlight" aria-hidden="true" />
          </div>
        </div>

        {/* Bottom Air-Jet Turbine & Studio Pedestal */}
        <div className="machine-pedestal">
          <div className={`pedestal-air-nozzle ${isTurbulent ? 'jet-active' : ''}`}>
            <div className="nozzle-grille">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="pedestal-body">
            <div className="pedestal-brand-strip">
              <span className="pedestal-dot" />
              <span className="pedestal-game-tag">
                {gameType === 'MEGA_645' ? 'MEGA 6/45 STUDIO' : 'POWER 6/55 STUDIO'}
              </span>
              <span className="pedestal-dot" />
            </div>

            <div className="pedestal-led-panel" role="status" aria-live="polite">
              <span className={`led-indicator state-dot-${drawState.toLowerCase()}`} />
              <span className="led-text">{getMachineStatusText()}</span>
            </div>
          </div>

          <div className="pedestal-base-plate" />
        </div>

        {/* Stage Floor Reflection Platform */}
        <div className="stage-floor-platform" aria-hidden="true">
          <div className="floor-neon-ring" />
          <div className="floor-glow-pool" />
        </div>
      </div>
    </div>
  );
};
