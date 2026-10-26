import React from 'react';
import { ArrowUpNarrowWide, Award, Sparkles } from 'lucide-react';
import { DrawResultData, DrawState, GameType } from '../types';
import { LotteryBall } from './LotteryBall';

interface DrawResultProps {
  gameType: GameType;
  drawState: DrawState;
  resultData: DrawResultData | null;
  revealedCount: number;
}

export const DrawResult: React.FC<DrawResultProps> = ({
  gameType,
  drawState,
  resultData,
  revealedCount,
}) => {
  const isPowerGame = gameType === 'POWER_655';
  const isFinished = drawState === 'FINISHED';

  // During DRAWING, display balls in the order they were drawn from the machine.
  // Once FINISHED, display the 6 main numbers sorted in ascending order.
  const displayedMainNumbers: (number | undefined)[] = Array.from({ length: 6 }, (_, index) => {
    if (!resultData) return undefined;
    if (isFinished) {
      return resultData.mainNumbers[index];
    }
    if (index < revealedCount) {
      return resultData.drawnOrder[index];
    }
    return undefined;
  });

  const isPowerRevealed =
    isPowerGame && resultData?.powerNumber !== undefined && (isFinished || revealedCount >= 7);

  const displayedPowerNumber = isPowerRevealed ? resultData?.powerNumber : undefined;

  return (
    <section className="draw-result-panel" aria-label="Kết quả quay thưởng">
      <div className="result-panel-header">
        <div className="result-header-left">
          <Award size={18} className="result-header-icon" />
          <h2 className="result-panel-title">KẾT QUẢ QUAY SỐ</h2>
          <span className="result-game-tag">
            {isPowerGame ? 'POWER 6/55' : 'MEGA 6/45'}
          </span>
        </div>

        <div className="result-header-right">
          {isFinished ? (
            <span className="sort-status-badge sorted">
              <ArrowUpNarrowWide size={14} />
              Đã sắp xếp tăng dần
            </span>
          ) : drawState === 'DRAWING' ? (
            <span className="sort-status-badge drawing">
              <Sparkles size={14} />
              Đang công bố từng quả cầu...
            </span>
          ) : (
            <span className="sort-status-badge idle">
              Thứ tự kết quả sẽ tự động sắp xếp tăng dần
            </span>
          )}
        </div>
      </div>

      <div className="result-balls-rack">
        <div className="main-balls-group">
          {displayedMainNumbers.map((num, idx) => (
            <LotteryBall
              key={isFinished && num ? `sorted-${idx}-${num}` : `slot-${idx}`}
              number={num}
              size="lg"
              slotIndex={idx + 1}
              animateEntry={num !== undefined && !isFinished}
              isSortedPulse={isFinished}
              label={`Số ${idx + 1}`}
            />
          ))}
        </div>

        {isPowerGame && (
          <>
            <div className="power-divider" aria-hidden="true">
              <span className="power-divider-line" />
              <span className="power-plus-symbol">+</span>
              <span className="power-divider-line" />
            </div>

            <div className="power-ball-group">
              <LotteryBall
                key={
                  displayedPowerNumber
                    ? `power-${displayedPowerNumber}`
                    : 'power-placeholder'
                }
                number={displayedPowerNumber}
                isPowerBall={true}
                size="lg"
                animateEntry={displayedPowerNumber !== undefined}
                label="Số Đặc Biệt"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};
