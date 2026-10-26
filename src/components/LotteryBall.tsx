import React from 'react';
import { formatBallNumber, getBallColorVariant } from '../utils/lottery';

interface LotteryBallProps {
  number?: number;
  isPowerBall?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animateEntry?: boolean;
  isSortedPulse?: boolean;
  label?: string;
  slotIndex?: number;
}

export const LotteryBall: React.FC<LotteryBallProps> = ({
  number,
  isPowerBall = false,
  size = 'lg',
  animateEntry = false,
  isSortedPulse = false,
  label,
  slotIndex,
}) => {
  const isRevealed = typeof number === 'number';
  const colorVariant = isRevealed ? getBallColorVariant(number, isPowerBall) : 'empty';

  return (
    <div className={`lottery-ball-wrapper size-${size} ${isPowerBall ? 'is-power-wrapper' : ''}`}>
      {isPowerBall && (
        <span className="power-crown-badge" aria-label="Quả cầu Power đặc biệt">
          POWER
        </span>
      )}

      <div className="lottery-ball-stage">
        {isRevealed ? (
          <div
            className={[
              'lottery-ball',
              `ball-${colorVariant}`,
              animateEntry ? 'ball-pop-in' : '',
              isPowerBall && animateEntry ? 'power-ball-dramatic-in' : '',
              isSortedPulse ? 'ball-sorted-pulse' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            role="img"
            aria-label={
              isPowerBall
                ? `Số Power ${formatBallNumber(number)}`
                : `Quả cầu số ${formatBallNumber(number)}`
            }
          >
            {/* 3D Specular Highlight */}
            <span className="ball-specular" aria-hidden="true" />
            {/* Inner Rim Light */}
            <span className="ball-rim-light" aria-hidden="true" />
            {/* Center Number Medallion */}
            <div className="ball-medallion">
              <span className="ball-number">{formatBallNumber(number)}</span>
            </div>
          </div>
        ) : (
          <div
            className={`lottery-ball-placeholder ${isPowerBall ? 'placeholder-power' : ''}`}
            aria-label={
              isPowerBall
                ? 'Vị trí số Power đang chờ công bố'
                : `Vị trí quả cầu số ${slotIndex ?? ''} đang chờ công bố`
            }
          >
            <span className="placeholder-ring" />
            <span className="placeholder-text">
              {isPowerBall ? 'PWR' : slotIndex ? `0${slotIndex}` : '--'}
            </span>
          </div>
        )}

        {/* 3D Floor Shadow */}
        <div
          className={`ball-floor-shadow ${isRevealed ? 'active' : ''} ${
            isPowerBall && isRevealed ? 'power-shadow' : ''
          }`}
          aria-hidden="true"
        />
      </div>

      {label && <span className="ball-slot-caption">{label}</span>}
    </div>
  );
};
